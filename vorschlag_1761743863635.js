const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'vorschlag',
    description: 'Reiche einen Vorschlag ein',
    async execute(message, args) {
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('💡 Vorschlag einreichen')
            .setDescription('Hast du eine Idee für die Familie? Klicke auf den Button, um deinen Vorschlag einzureichen!')
            .setTimestamp();

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`vorschlag_create_${message.author.id}`)
                    .setLabel('💡 Vorschlag einreichen')
                    .setStyle(ButtonStyle.Success)
            );

        await message.channel.send({ embeds: [embed], components: [button] });
        await message.delete().catch(() => {});
    },

    async handleButton(interaction, client) {
        if (interaction.customId.startsWith('vorschlag_create')) {
            const userId = interaction.customId.split('_').pop();
            
            if (interaction.user.id !== userId) {
                return interaction.reply({ content: '❌ Das ist nicht dein Button!', ephemeral: true });
            }

            const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

            const modal = new ModalBuilder()
                .setCustomId('vorschlag_modal')
                .setTitle('Vorschlag einreichen');

            const titleInput = new TextInputBuilder()
                .setCustomId('vorschlag_titel')
                .setLabel('Titel deines Vorschlags')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const ideaInput = new TextInputBuilder()
                .setCustomId('vorschlag_idee')
                .setLabel('Beschreibe deine Idee')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(titleInput),
                new ActionRowBuilder().addComponents(ideaInput)
            );

            await interaction.showModal(modal);
        }
    },

    async handleModal(interaction, client) {
        if (interaction.customId === 'vorschlag_modal') {
            const title = interaction.fields.getTextInputValue('vorschlag_titel');
            const idea = interaction.fields.getTextInputValue('vorschlag_idee');

            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle(`💡 ${title}`)
                .setDescription(idea)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setFooter({ text: 'Neuer Vorschlag' })
                .setTimestamp();

            try {
                const suggestionChannel = await client.channels.fetch(config.SUGGESTION_CHANNEL_ID);
                await suggestionChannel.send({ embeds: [embed] });
                await interaction.reply({ content: '✅ Dein Vorschlag wurde eingereicht!', ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: '❌ Fehler beim Einreichen des Vorschlags!', ephemeral: true });
            }
        }
    }
};
