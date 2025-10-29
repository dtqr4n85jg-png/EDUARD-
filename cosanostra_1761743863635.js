const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'cosanostra',
    description: 'Erzählt eine Mafia Geschichte',
    async execute(message, args) {
        const stories = [
            'In den dunklen Gassen Siziliens begann alles. Die Cosa Nostra, eine Bruderschaft, die auf Ehre und Loyalität basiert. Verrat wird mit dem Tod bestraft. Omertà - das Schweigen - ist das höchste Gebot.',
            'Don Vito saß in seinem Büro, umgeben von Rauch und Schatten. "Die Familie ist alles", sagte er leise. "Wer die Familie verrät, verrät sich selbst." Seine Worte waren Gesetz.',
            'Unter dem Vollmond trafen sich die Capos. Ein neuer Soldat sollte aufgenommen werden. Der Blutschwur wurde gesprochen: "Ich schwöre bei meiner Ehre, der Familie bis zum Tod treu zu sein."',
            'Die Cosa Nostra vergisst nie. Ein Freund der Familie ist immer willkommen. Ein Feind wird nie sicher sein. So war es immer, so wird es immer sein.',
        ];

        const randomStory = stories[Math.floor(Math.random() * stories.length)];

        const embed = new EmbedBuilder()
            .setColor('#2C2C2C')
            .setTitle('💀 Cosa Nostra')
            .setDescription(randomStory)
            .setThumbnail('https://i.imgur.com/mafia-placeholder.png')
            .setFooter({ text: 'Omertà - Das Gesetz des Schweigens' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
