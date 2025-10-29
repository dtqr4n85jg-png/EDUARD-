const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, ChannelType } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'setupticket',
    description: 'Erstellt ein Ticket-System',
    async execute(message, args) {
        if (!message.member.roles.cache.has(config.MODERATOR_ROLE_ID)) {
            return message.reply('❌ Du hast keine Berechtigung für diesen Befehl!');
        }

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('🎫 TICKET SYSTEM')
            .setDescription('Wähle eine Kategorie, um ein Ticket zu erstellen:\n\n🗨️ **Beschwerden** - Reiche eine Beschwerde ein\n🛠️ **Support** - Benötigst du Hilfe?\n📝 **Bewerben** - Bewirb dich für die Familie!')
            .setImage('https://i.imgur.com/ticket-placeholder.png')
            .setFooter({ text: 'Klicke auf einen Button, um ein Ticket zu erstellen' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket_beschwerde')
                    .setLabel('🗨️ Beschwerden')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('ticket_support')
                    .setLabel('🛠️ Support')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('ticket_bewerben')
                    .setLabel('📝 Bewerben')
                    .setStyle(ButtonStyle.Success)
            );

        await message.channel.send({ embeds: [embed], components: [row] });
        await message.delete().catch(() => {});
    },

    async handleButton(interaction, client) {
        if (interaction.customId === 'ticket_bewerben') {
            const modal = new ModalBuilder()
                .setCustomId('bewerben_modal')
                .setTitle('Bewerbung für die Familie');

            const questions = [
                { id: 'spraydosen', label: 'Wieviel Spraydosen hast du?', style: TextInputStyle.Short },
                { id: 'aktivitaet', label: 'Wie aktiv bist du?', style: TextInputStyle.Short },
                { id: 'vorherige_gang', label: 'Welche Gang/Familie warst du davor?', style: TextInputStyle.Short },
                { id: 'ak_level', label: 'Welche AK-Level hast du?', style: TextInputStyle.Short },
                { id: 'schuetze', label: 'Siehst du dich als guter Schütze?', style: TextInputStyle.Short }
            ];

            questions.forEach(q => {
                const input = new TextInputBuilder()
                    .setCustomId(q.id)
                    .setLabel(q.label)
                    .setStyle(q.style)
                    .setRequired(true);
                modal.addComponents(new ActionRowBuilder().addComponents(input));
            });

            return interaction.showModal(modal);
        }

        const ticketTypes = {
            'ticket_beschwerde': { name: 'Beschwerde', emoji: '🗨️', color: '#FF0000' },
            'ticket_support': { name: 'Support', emoji: '🛠️', color: '#0099FF' }
        };

        const ticketType = ticketTypes[interaction.customId];
        if (!ticketType) return;

        const ticketName = `${ticketType.emoji}-${ticketType.name.toLowerCase()}-${interaction.user.username}`;

        try {
            const ticketChannel = await interaction.guild.channels.create({
                name: ticketName,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                    {
                        id: config.MODERATOR_ROLE_ID,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
            });

            const ticketEmbed = new EmbedBuilder()
                .setColor(ticketType.color)
                .setTitle(`${ticketType.emoji} ${ticketType.name} Ticket`)
                .setDescription(`Hallo ${interaction.user},\n\nDein Ticket wurde erstellt. Ein Teammitglied wird sich bald um dein Anliegen kümmern.\n\nBitte beschreibe dein Problem so detailliert wie möglich.`)
                .setFooter({ text: 'Ticket System' })
                .setTimestamp();

            const closeButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('🗑️ Ticket schließen')
                        .setStyle(ButtonStyle.Danger)
                );

            await ticketChannel.send({ content: `${interaction.user} <@&${config.MODERATOR_ROLE_ID}>`, embeds: [ticketEmbed], components: [closeButton] });

            await interaction.reply({ content: `✅ Dein Ticket wurde erstellt: ${ticketChannel}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: '❌ Fehler beim Erstellen des Tickets!', ephemeral: true });
        }
    },

    async handleModal(interaction, client) {
        if (interaction.customId === 'bewerben_modal') {
            const answers = {
                spraydosen: interaction.fields.getTextInputValue('spraydosen'),
                aktivitaet: interaction.fields.getTextInputValue('aktivitaet'),
                vorherige_gang: interaction.fields.getTextInputValue('vorherige_gang'),
                ak_level: interaction.fields.getTextInputValue('ak_level'),
                schuetze: interaction.fields.getTextInputValue('schuetze')
            };

            const ticketName = `📝-bewerbung-${interaction.user.username}`;

            try {
                const ticketChannel = await interaction.guild.channels.create({
                    name: ticketName,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                        {
                            id: config.MODERATOR_ROLE_ID,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                    ],
                });

                const applicationEmbed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('📝 Bewerbung')
                    .setDescription(`**Bewerbung von ${interaction.user.tag}**`)
                    .addFields(
                        { name: '1. Wieviel Spraydosen hast du?', value: answers.spraydosen },
                        { name: '2. Wie aktiv bist du?', value: answers.aktivitaet },
                        { name: '3. Welche Gang/Familie warst du davor?', value: answers.vorherige_gang },
                        { name: '4. Welche AK-Level hast du?', value: answers.ak_level },
                        { name: '5. Siehst du dich als guter Schütze?', value: answers.schuetze }
                    )
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();

                const closeButton = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('close_ticket')
                            .setLabel('🗑️ Ticket schließen')
                            .setStyle(ButtonStyle.Danger)
                    );

                await ticketChannel.send({ content: `${interaction.user} <@&${config.MODERATOR_ROLE_ID}>`, embeds: [applicationEmbed], components: [closeButton] });

                await interaction.reply({ content: `✅ Deine Bewerbung wurde eingereicht: ${ticketChannel}`, ephemeral: true });
            } catch (error) {
                console.error(error);
                interaction.reply({ content: '❌ Fehler beim Erstellen der Bewerbung!', ephemeral: true });
            }
        }
    }
};

module.exports.closeticket = {
    name: 'closeticket',
    description: 'Schließt ein Ticket',
    async execute(message, args) {
        if (!message.member.roles.cache.has(config.MODERATOR_ROLE_ID)) {
            return message.reply('❌ Du hast keine Berechtigung für diesen Befehl!');
        }

        if (!message.channel.name.includes('beschwerde') && 
            !message.channel.name.includes('support') && 
            !message.channel.name.includes('bewerbung')) {
            return message.reply('❌ Dieser Befehl kann nur in Ticket-Channels verwendet werden!');
        }

        await message.channel.send('🗑️ Ticket wird in 3 Sekunden geschlossen...');
        setTimeout(() => {
            message.channel.delete().catch(console.error);
        }, 3000);
    }
};
