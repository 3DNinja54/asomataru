module.exports = {
    name: 'profile',
    aliases: ['stats'],
    permissions: [],
    ownerOnly: false,
    enabled: true,
    cooldown: 0,
    exec: async (client, message, args) => {
      const User = require('../../models/userModel.js');
      const Discord = require('discord.js');
      let member = message.guild.member(message.mentions.users.first() || message.author)
      if(member.user.bot) return message.reply(`That is a bot.`)
      let data = await User.findOne({userID: member.user.id })
  
      if(!data) await User.create({ userID: member.user.id })
  
      const userStats = [
        `Balance: ${data.account.coins} Coins`,
        `HP: ${user.account.hp} Health`,
        `Level: ${user.account.level}`,
        `XP: ${user.account.xp} XP`,
        `XP to Level Up: ${user.xp - user.xpRemaining}`
      ]
      const embed = new Discord.MessageEmbed()
      .setTitle(`${message.author.username}'s Balance`)
      .setDescription(userStats)
      .setFooter('Asomataru RPG System v0.1 Beta!')
      message.channel.send(embed)
    }
  }