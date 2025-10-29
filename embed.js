const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'embed',
    description: 'Erstellt ein individuelles Embed',
    async execute(message, args) {
        if (!message.member.roles.cache.has(config.MODERATOR_ROLE_ID)) {
            return message.reply('❌ Du hast keine Berechtigung für diesen Befehl!');
        }

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('🧾 Embed Ersteller')
            .setDescription('Klicke auf den Button, um ein Custom Embed zu erstellen!')
            .setTimestamp();

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`embed_create_${message.author.id}`)
                    .setLabel('📝 Embed erstellen')
                    .setStyle(ButtonStyle.Primary)
            );

        await message.channel.send({ embeds: [embed], components: [button] });
        await message.delete().catch(() => {});
    },

    async handleButton(interaction, client) {
        if (interaction.customId.startsWith('embed_create')) {
            const userId = interaction.customId.split('_').pop();
            
            if (interaction.user.id !== userId) {
                return interaction.reply({ content: '❌ Das ist nicht dein Button!', ephemeral: true });
            }

            const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

            const modal = new ModalBuilder()
                .setCustomId('embed_modal')
                .setTitle('Embed erstellen');

            const titleInput = new TextInputBuilder()
                .setCustomId('embed_title')
                .setLabel('Titel')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const descInput = new TextInputBuilder()
                .setCustomId('embed_desc')
                .setLabel('Beschreibung')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const colorInput = new TextInputBuilder()
                .setCustomId('embed_color')
                .setLabel('Farbe (Hex-Code z.B. #FF5733)')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setValue('#FFA500');

            const imageInput = new TextInputBuilder()
                .setCustomId('embed_image')
                .setLabel('Bild URL (optional)')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            modal.addComponents(
                new ActionRowBuilder().addComponents(titleInput),
                new ActionRowBuilder().addComponents(descInput),
                new ActionRowBuilder().addComponents(colorInput),
                new ActionRowBuilder().addComponents(imageInput)
            );

            await interaction.showModal(modal);
        }
    },

    async handleModal(interaction, client) {
        if (interaction.customId === 'embed_modal') {
            const title = interaction.fields.getTextInputValue('embed_title');
            const description = interaction.fields.getTextInputValue('embed_desc');
            const color = interaction.fields.getTextInputValue('embed_color') || '#FFA500';
            const image = interaction.fields.getTextInputValue('embed_image') || null;

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(title)
                .setDescription(description)
                .setTimestamp();

            if (image) {
                embed.setImage(image);
            }

            await interaction.channel.send({ embeds: [embed] });
            await interaction.reply({ content: '✅ Embed wurde erstellt!', ephemeral: true });
        }
    }
};
