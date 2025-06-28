
const { Client, GatewayIntentBits, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

// Uptime endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    bot_status: client.user ? 'Ready' : 'Not Ready',
    guilds: client.guilds ? client.guilds.cache.size : 0
  });
});

app.get('/ping', (req, res) => {
  res.json({ message: 'pong', timestamp: Date.now() });
});

app.get('/status', (req, res) => {
  res.json({
    bot_name: client.user ? client.user.tag : 'Not logged in',
    bot_id: client.user ? client.user.id : null,
    guilds_count: client.guilds ? client.guilds.cache.size : 0,
    uptime_seconds: process.uptime(),
    memory_usage: process.memoryUsage(),
    node_version: process.version
  });
});

// Start Express server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Uptime server running on port ${PORT}`);
});

const TOKEN = process.env.BOT_TOKEN;

// Economy data storage (in production, use a database)
const userBalances = new Map();
const userInventories = new Map();

// Suggestion system data storage (in production, use a database)
const guildSettings = new Map();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const commands = [
  {
    name: 'bot',
    description: 'Bot related commands',
    options: [
      {
        name: 'invite',
        description: "Get bot's invite",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'stats',
        description: "Get bot's statistics",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'uptime',
        description: "Get bot's uptime",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'permissions',
        description: "Check bot's server permissions",
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
  },
  {
    name: 'dog',
    description: 'Get a random dog image',
  },
  {
    name: 'info',
    description: 'Show various information',
    options: [
      {
        name: 'user',
        description: 'Get user information',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'name',
            description: 'Name of the user',
            type: ApplicationCommandOptionType.User,
            required: false,
          },
        ],
      },
      {
        name: 'channel',
        description: 'Get channel information',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'name',
            description: 'Name of the channel',
            type: ApplicationCommandOptionType.Channel,
            required: false,
          },
        ],
      },
      {
        name: 'guild',
        description: 'Get guild information',
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'bot',
        description: 'Get bot information',
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'avatar',
        description: 'Display avatar information',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'name',
            description: 'Name of the user',
            type: ApplicationCommandOptionType.User,
            required: false,
          },
        ],
      },
      {
        name: 'emoji',
        description: 'Display emoji information',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'name',
            description: 'Name of the emoji',
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
    ],
  },
  {
    name: 'eco',
    description: 'Economy bot commands',
    options: [
      {
        name: 'balance',
        description: 'Check your balance',
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'wallet',
        description: 'View your wallet details',
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'daily',
        description: 'Claim your daily reward',
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'work',
        description: 'Work to earn money',
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'shop',
        description: 'View the shop',
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'buy',
        description: 'Buy an item from the shop',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'item',
            description: 'Item to buy',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
              { name: 'Coffee', value: 'coffee' },
              { name: 'Laptop', value: 'laptop' },
              { name: 'Car', value: 'car' }
            ]
          }
        ]
      },
      {
        name: 'inventory',
        description: 'Check your inventory',
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'give',
        description: 'Give money to another user',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'user',
            description: 'User to give money to',
            type: ApplicationCommandOptionType.User,
            required: true
          },
          {
            name: 'amount',
            description: 'Amount to give',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1
          }
        ]
      },
      {
        name: 'pay',
        description: 'Pay money to another user',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'user',
            description: 'User to pay',
            type: ApplicationCommandOptionType.User,
            required: true
          },
          {
            name: 'amount',
            description: 'Amount to pay',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1
          }
        ]
      },
      {
        name: 'leaderboard',
        description: 'View the richest users',
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'coinflip',
        description: 'Flip a coin and gamble',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'amount',
            description: 'Amount to bet',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1
          },
          {
            name: 'choice',
            description: 'Heads or Tails',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
              { name: 'Heads', value: 'heads' },
              { name: 'Tails', value: 'tails' }
            ]
          }
        ]
      },
      {
        name: 'gamble',
        description: 'Gamble your money',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'amount',
            description: 'Amount to gamble',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1
          }
        ]
      },
      {
        name: 'slots',
        description: 'Play the slot machine',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'amount',
            description: 'Amount to bet',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1
          }
        ]
      },
      {
        name: 'beg',
        description: 'Beg for money',
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'rob-bank',
        description: 'Attempt to rob a bank',
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'rob-atm',
        description: 'Attempt to rob an ATM',
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'mines',
        description: 'Play minesweeper gambling game',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'amount',
            description: 'Amount to bet',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1
          }
        ]
      },
      {
        name: 'roulette',
        description: 'Play roulette',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'amount',
            description: 'Amount to bet',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1
          },
          {
            name: 'choice',
            description: 'What to bet on',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
              { name: 'Red', value: 'red' },
              { name: 'Black', value: 'black' },
              { name: 'Green', value: 'green' }
            ]
          }
        ]
      },
      {
        name: 'towers',
        description: 'Play the towers game',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'amount',
            description: 'Amount to bet',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1
          }
        ]
      },
      {
        name: 'whack',
        description: 'Play whack-a-mole for money',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'amount',
            description: 'Amount to bet',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1
          }
        ]
      }
    ]
  },
  {
    name: 'suggestion',
    description: 'Configure suggestion system',
    options: [
      {
        name: 'status',
        description: 'Enable or disable suggestion system',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'status',
            description: 'Enabled or disabled',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
              { name: 'ON', value: 'ON' },
              { name: 'OFF', value: 'OFF' }
            ]
          }
        ]
      },
      {
        name: 'channel',
        description: 'Configure suggestion channel',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'channel',
            description: 'The channel where suggestions will be sent',
            type: ApplicationCommandOptionType.Channel,
            required: false
          }
        ]
      },
      {
        name: 'appch',
        description: 'Configure approved suggestions channel',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'channel',
            description: 'The channel where approved suggestions will be sent',
            type: ApplicationCommandOptionType.Channel,
            required: false
          }
        ]
      },
      {
        name: 'rejch',
        description: 'Configure rejected suggestions channel',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'channel',
            description: 'The channel where rejected suggestions will be sent',
            type: ApplicationCommandOptionType.Channel,
            required: false
          }
        ]
      },
      {
        name: 'approve',
        description: 'Approve a suggestion',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'channel',
            description: 'The channel where message exists',
            type: ApplicationCommandOptionType.Channel,
            required: true
          },
          {
            name: 'message_id',
            description: 'The message ID of the suggestion',
            type: ApplicationCommandOptionType.String,
            required: true
          },
          {
            name: 'reason',
            description: 'The reason for approval',
            type: ApplicationCommandOptionType.String,
            required: false
          }
        ]
      },
      {
        name: 'reject',
        description: 'Reject a suggestion',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'channel',
            description: 'The channel where message exists',
            type: ApplicationCommandOptionType.Channel,
            required: true
          },
          {
            name: 'message_id',
            description: 'The message ID of the suggestion',
            type: ApplicationCommandOptionType.String,
            required: true
          },
          {
            name: 'reason',
            description: 'The reason for rejection',
            type: ApplicationCommandOptionType.String,
            required: false
          }
        ]
      },
      {
        name: 'staffadd',
        description: 'Add a staff role',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'role',
            description: 'The role to add as staff',
            type: ApplicationCommandOptionType.Role,
            required: true
          }
        ]
      },
      {
        name: 'staffremove',
        description: 'Remove a staff role',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'role',
            description: 'The role to remove from staff',
            type: ApplicationCommandOptionType.Role,
            required: true
          }
        ]
      }
    ]
  },
  {
    name: 'suggest',
    description: 'Submit a suggestion',
    options: [
      {
        name: 'suggestion',
        description: 'Your suggestion',
        type: ApplicationCommandOptionType.String,
        required: true
      }
    ]
  }
];

const shopItems = {
  coffee: { name: 'Coffee', price: 50, emoji: '☕' },
  laptop: { name: 'Laptop', price: 1000, emoji: '💻' },
  car: { name: 'Car', price: 25000, emoji: '🚗' }
};

const dailyCooldowns = new Map();
const begCooldowns = new Map();
const robCooldowns = new Map();
const gameStates = new Map();

// Suggestion system helper functions
function getGuildSettings(guildId) {
  if (!guildSettings.has(guildId)) {
    guildSettings.set(guildId, {
      suggestions: {
        enabled: false,
        channel_id: null,
        approved_channel: null,
        rejected_channel: null,
        staff_roles: []
      }
    });
  }
  return guildSettings.get(guildId);
}

const CHANNEL_PERMS = ['ViewChannel', 'SendMessages', 'EmbedLinks', 'ManageMessages', 'ReadMessageHistory'];

function hasStaffRole(member, staffRoles) {
  return member.permissions.has('ManageGuild') || staffRoles.some(roleId => member.roles.cache.has(roleId));
}

async function setStatus(guildId, status) {
  const settings = getGuildSettings(guildId);
  const enabled = status.toUpperCase() === 'ON';
  settings.suggestions.enabled = enabled;
  return `Suggestion system is now ${enabled ? 'enabled' : 'disabled'}`;
}

async function setChannel(guildId, channel) {
  const settings = getGuildSettings(guildId);
  if (!channel) {
    settings.suggestions.channel_id = null;
    return 'Suggestion system is now disabled';
  }

  const botMember = channel.guild.members.me;
  const hasPerms = CHANNEL_PERMS.every(perm => channel.permissionsFor(botMember).has(perm));
  
  if (!hasPerms) {
    return `I need the following permissions in ${channel}: ${CHANNEL_PERMS.join(', ')}`;
  }

  settings.suggestions.channel_id = channel.id;
  return `Suggestions will now be sent to ${channel}`;
}

async function setApprovedChannel(guildId, channel) {
  const settings = getGuildSettings(guildId);
  if (!channel) {
    settings.suggestions.approved_channel = null;
    return 'Suggestion approved channel is now disabled';
  }

  const botMember = channel.guild.members.me;
  const hasPerms = CHANNEL_PERMS.every(perm => channel.permissionsFor(botMember).has(perm));
  
  if (!hasPerms) {
    return `I need the following permissions in ${channel}: ${CHANNEL_PERMS.join(', ')}`;
  }

  settings.suggestions.approved_channel = channel.id;
  return `Approved suggestions will now be sent to ${channel}`;
}

async function setRejectedChannel(guildId, channel) {
  const settings = getGuildSettings(guildId);
  if (!channel) {
    settings.suggestions.rejected_channel = null;
    return 'Suggestion rejected channel is now disabled';
  }

  const botMember = channel.guild.members.me;
  const hasPerms = CHANNEL_PERMS.every(perm => channel.permissionsFor(botMember).has(perm));
  
  if (!hasPerms) {
    return `I need the following permissions in ${channel}: ${CHANNEL_PERMS.join(', ')}`;
  }

  settings.suggestions.rejected_channel = channel.id;
  return `Rejected suggestions will now be sent to ${channel}`;
}

async function addStaffRole(guildId, role) {
  const settings = getGuildSettings(guildId);
  if (settings.suggestions.staff_roles.includes(role.id)) {
    return `\`${role.name}\` is already a staff role`;
  }
  settings.suggestions.staff_roles.push(role.id);
  return `\`${role.name}\` is now a staff role`;
}

async function removeStaffRole(guildId, role) {
  const settings = getGuildSettings(guildId);
  if (!settings.suggestions.staff_roles.includes(role.id)) {
    return `\`${role.name}\` is not a staff role`;
  }
  settings.suggestions.staff_roles.splice(settings.suggestions.staff_roles.indexOf(role.id), 1);
  return `\`${role.name}\` is no longer a staff role`;
}

async function approveSuggestion(member, channel, messageId, reason) {
  const settings = getGuildSettings(member.guild.id);
  
  if (!hasStaffRole(member, settings.suggestions.staff_roles)) {
    return '❌ You do not have permission to approve suggestions!';
  }

  try {
    const message = await channel.messages.fetch(messageId);
    if (!message.embeds[0]) {
      return '❌ This message is not a suggestion!';
    }

    const embed = new EmbedBuilder(message.embeds[0])
      .setColor('#00ff00')
      .setTitle('✅ Suggestion Approved')
      .addFields({ name: 'Approved by', value: member.toString(), inline: true });

    if (reason) {
      embed.addFields({ name: 'Reason', value: reason, inline: false });
    }

    await message.edit({ embeds: [embed] });

    // Send to approved channel if configured
    if (settings.suggestions.approved_channel) {
      const approvedChannel = member.guild.channels.cache.get(settings.suggestions.approved_channel);
      if (approvedChannel) {
        await approvedChannel.send({ embeds: [embed] });
      }
    }

    return '✅ Suggestion approved successfully!';
  } catch (error) {
    return '❌ Could not find the message or an error occurred!';
  }
}

async function rejectSuggestion(member, channel, messageId, reason) {
  const settings = getGuildSettings(member.guild.id);
  
  if (!hasStaffRole(member, settings.suggestions.staff_roles)) {
    return '❌ You do not have permission to reject suggestions!';
  }

  try {
    const message = await channel.messages.fetch(messageId);
    if (!message.embeds[0]) {
      return '❌ This message is not a suggestion!';
    }

    const embed = new EmbedBuilder(message.embeds[0])
      .setColor('#ff0000')
      .setTitle('❌ Suggestion Rejected')
      .addFields({ name: 'Rejected by', value: member.toString(), inline: true });

    if (reason) {
      embed.addFields({ name: 'Reason', value: reason, inline: false });
    }

    await message.edit({ embeds: [embed] });

    // Send to rejected channel if configured
    if (settings.suggestions.rejected_channel) {
      const rejectedChannel = member.guild.channels.cache.get(settings.suggestions.rejected_channel);
      if (rejectedChannel) {
        await rejectedChannel.send({ embeds: [embed] });
      }
    }

    return '✅ Suggestion rejected successfully!';
  } catch (error) {
    return '❌ Could not find the message or an error occurred!';
  }
}

function getBalance(userId) {
  return userBalances.get(userId) || 0;
}

function setBalance(userId, amount) {
  userBalances.set(userId, amount);
}

function addToInventory(userId, item) {
  if (!userInventories.has(userId)) {
    userInventories.set(userId, {});
  }
  const inventory = userInventories.get(userId);
  inventory[item] = (inventory[item] || 0) + 1;
}

function getInventory(userId) {
  return userInventories.get(userId) || {};
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  try {
    console.log('Registering slash commands...');
    await client.application.commands.set(commands);
    console.log('Slash commands registered successfully!');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
});

const botStartTime = Date.now();

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'bot') {
    const subcommand = interaction.options.getSubcommand();
    
    try {
      switch (subcommand) {
        case 'invite':
          const inviteEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🔗 Bot Invite Link')
            .setDescription(`[Click here to invite me to your server!](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`)
            .setTimestamp();
          await interaction.reply({ embeds: [inviteEmbed] });
          break;

        case 'stats':
          const guilds = client.guilds.cache.size;
          const users = client.users.cache.size;
          const channels = client.channels.cache.size;
          
          const statsEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('📊 Bot Statistics')
            .addFields(
              { name: '🏠 Servers', value: guilds.toString(), inline: true },
              { name: '👥 Users', value: users.toString(), inline: true },
              { name: '📺 Channels', value: channels.toString(), inline: true }
            )
            .setTimestamp();
          await interaction.reply({ embeds: [statsEmbed] });
          break;

        case 'uptime':
          const uptime = Date.now() - botStartTime;
          const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
          const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
          
          const uptimeEmbed = new EmbedBuilder()
            .setColor('#ffff00')
            .setTitle('⏰ Bot Uptime')
            .setDescription(`**${days}d ${hours}h ${minutes}m ${seconds}s**`)
            .setTimestamp();
          await interaction.reply({ embeds: [uptimeEmbed] });
          break;

        case 'permissions':
          const botMember = interaction.guild.members.me;
          const permissions = botMember.permissions;
          
          const requiredPermissions = [
            'ViewChannel',
            'SendMessages',
            'EmbedLinks',
            'ReadMessageHistory',
            'UseSlashCommands',
            'ManageMessages',
            'AddReactions',
            'AttachFiles'
          ];
          
          const importantPermissions = [
            'Administrator',
            'ManageGuild',
            'ManageChannels',
            'ManageRoles',
            'KickMembers',
            'BanMembers'
          ];
          
          let permissionStatus = '';
          
          // Check required permissions
          permissionStatus += '**Essential Permissions:**\n';
          for (const perm of requiredPermissions) {
            const hasPermission = permissions.has(perm);
            permissionStatus += `${hasPermission ? '✅' : '❌'} ${perm}\n`;
          }
          
          permissionStatus += '\n**Administrative Permissions:**\n';
          for (const perm of importantPermissions) {
            const hasPermission = permissions.has(perm);
            permissionStatus += `${hasPermission ? '✅' : '❌'} ${perm}\n`;
          }
          
          const permissionsEmbed = new EmbedBuilder()
            .setColor(permissions.has('Administrator') ? '#00ff00' : '#ffaa00')
            .setTitle('🔒 Bot Server Permissions')
            .setDescription(permissionStatus)
            .addFields({
              name: 'Permission Integer',
              value: permissions.bitfield.toString(),
              inline: true
            })
            .setTimestamp();
          
          await interaction.reply({ embeds: [permissionsEmbed] });
          break;
      }
    } catch (error) {
      console.error('Error handling bot command:', error);
      await interaction.reply('❌ An error occurred while processing your command.');
    }
  }

  if (interaction.commandName === 'dog') {
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await response.json();
      
      const dogEmbed = new EmbedBuilder()
        .setColor('#ff6b35')
        .setTitle('🐕 Random Dog')
        .setImage(data.message)
        .setTimestamp();
      await interaction.reply({ embeds: [dogEmbed] });
    } catch (error) {
      console.error('Error fetching dog image:', error);
      await interaction.reply('❌ Failed to fetch dog image.');
    }
  }

  if (interaction.commandName === 'info') {
    const subcommand = interaction.options.getSubcommand();
    
    try {
      switch (subcommand) {
        case 'user':
          const user = interaction.options.getUser('name') || interaction.user;
          const member = interaction.guild.members.cache.get(user.id);
          
          const userEmbed = new EmbedBuilder()
            .setColor('#9932cc')
            .setTitle(`👤 User Information - ${user.username}`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
              { name: 'Username', value: user.username, inline: true },
              { name: 'ID', value: user.id, inline: true },
              { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
            );
          
          if (member) {
            userEmbed.addFields(
              { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
              { name: 'Roles', value: member.roles.cache.map(r => r.name).slice(0, 10).join(', ') || 'None', inline: false }
            );
          }
          
          await interaction.reply({ embeds: [userEmbed] });
          break;

        case 'channel':
          const channel = interaction.options.getChannel('name') || interaction.channel;
          
          const channelEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`📺 Channel Information - ${channel.name}`)
            .addFields(
              { name: 'Name', value: channel.name, inline: true },
              { name: 'ID', value: channel.id, inline: true },
              { name: 'Type', value: channel.type.toString(), inline: true },
              { name: 'Created', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:R>`, inline: true }
            );
          
          if (channel.topic) {
            channelEmbed.addFields({ name: 'Topic', value: channel.topic, inline: false });
          }
          
          await interaction.reply({ embeds: [channelEmbed] });
          break;

        case 'guild':
          const guild = interaction.guild;
          
          const guildEmbed = new EmbedBuilder()
            .setColor('#ffd700')
            .setTitle(`🏠 Server Information - ${guild.name}`)
            .setThumbnail(guild.iconURL())
            .addFields(
              { name: 'Name', value: guild.name, inline: true },
              { name: 'ID', value: guild.id, inline: true },
              { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
              { name: 'Members', value: guild.memberCount.toString(), inline: true },
              { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true },
              { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
            );
          
          await interaction.reply({ embeds: [guildEmbed] });
          break;

        case 'bot':
          const botEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle(`🤖 Bot Information - ${client.user.username}`)
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
              { name: 'Username', value: client.user.username, inline: true },
              { name: 'ID', value: client.user.id, inline: true },
              { name: 'Created', value: `<t:${Math.floor(client.user.createdTimestamp / 1000)}:R>`, inline: true },
              { name: 'Servers', value: client.guilds.cache.size.toString(), inline: true },
              { name: 'Users', value: client.users.cache.size.toString(), inline: true },
              { name: 'Node.js', value: process.version, inline: true }
            );
          
          await interaction.reply({ embeds: [botEmbed] });
          break;

        case 'avatar':
          const avatarUser = interaction.options.getUser('name') || interaction.user;
          
          const avatarEmbed = new EmbedBuilder()
            .setColor('#ff1493')
            .setTitle(`🖼️ Avatar - ${avatarUser.username}`)
            .setImage(avatarUser.displayAvatarURL({ size: 512 }))
            .setTimestamp();
          
          await interaction.reply({ embeds: [avatarEmbed] });
          break;

        case 'emoji':
          const emojiName = interaction.options.getString('name');
          const emoji = interaction.guild.emojis.cache.find(e => e.name === emojiName);
          
          if (!emoji) {
            await interaction.reply(`❌ Emoji "${emojiName}" not found in this server.`);
            return;
          }
          
          const emojiEmbed = new EmbedBuilder()
            .setColor('#ff6b35')
            .setTitle(`😀 Emoji Information - ${emoji.name}`)
            .setThumbnail(emoji.url)
            .addFields(
              { name: 'Name', value: emoji.name, inline: true },
              { name: 'ID', value: emoji.id, inline: true },
              { name: 'Animated', value: emoji.animated ? 'Yes' : 'No', inline: true },
              { name: 'Created', value: `<t:${Math.floor(emoji.createdTimestamp / 1000)}:R>`, inline: true },
              { name: 'URL', value: `[Click here](${emoji.url})`, inline: true }
            );
          
          await interaction.reply({ embeds: [emojiEmbed] });
          break;
      }
    } catch (error) {
      console.error('Error handling info command:', error);
      await interaction.reply('❌ An error occurred while processing your command.');
    }
  }

  if (interaction.commandName === 'eco') {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    try {
      switch (subcommand) {
        case 'balance':
          const balance = getBalance(userId);
          const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('💰 Your Balance')
            .setDescription(`You have **$${balance}**`)
            .setTimestamp();
          await interaction.reply({ embeds: [embed] });
          break;

        case 'daily':
          const now = Date.now();
          const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours
          const lastDaily = dailyCooldowns.get(userId) || 0;
          
          if (now - lastDaily < cooldownTime) {
            const timeLeft = cooldownTime - (now - lastDaily);
            const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
            const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
            
            await interaction.reply(`⏰ You already claimed your daily reward! Come back in **${hoursLeft}h ${minutesLeft}m**`);
            return;
          }

          const dailyAmount = Math.floor(Math.random() * 500) + 100; // 100-600
          setBalance(userId, getBalance(userId) + dailyAmount);
          dailyCooldowns.set(userId, now);
          
          const dailyEmbed = new EmbedBuilder()
            .setColor('#ffff00')
            .setTitle('🎁 Daily Reward')
            .setDescription(`You received **$${dailyAmount}**!`)
            .setTimestamp();
          await interaction.reply({ embeds: [dailyEmbed] });
          break;

        case 'work':
          const workAmount = Math.floor(Math.random() * 200) + 50; // 50-250
          setBalance(userId, getBalance(userId) + workAmount);
          
          const workMessages = [
            'You worked as a developer and earned',
            'You delivered food and earned',
            'You walked dogs and earned',
            'You did freelance work and earned',
            'You worked at a coffee shop and earned'
          ];
          
          const randomMessage = workMessages[Math.floor(Math.random() * workMessages.length)];
          
          const workEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('💼 Work Complete')
            .setDescription(`${randomMessage} **$${workAmount}**!`)
            .setTimestamp();
          await interaction.reply({ embeds: [workEmbed] });
          break;

        case 'shop':
          const shopEmbed = new EmbedBuilder()
            .setColor('#ff9900')
            .setTitle('🛒 Shop')
            .setDescription('Available items:')
            .setTimestamp();
          
          for (const [key, item] of Object.entries(shopItems)) {
            shopEmbed.addFields({
              name: `${item.emoji} ${item.name}`,
              value: `Price: $${item.price}`,
              inline: true
            });
          }
          
          await interaction.reply({ embeds: [shopEmbed] });
          break;

        case 'buy':
          const itemKey = interaction.options.getString('item');
          const item = shopItems[itemKey];
          const userBalance = getBalance(userId);
          
          if (userBalance < item.price) {
            await interaction.reply(`❌ You don't have enough money! You need **$${item.price}** but only have **$${userBalance}**.`);
            return;
          }
          
          setBalance(userId, userBalance - item.price);
          addToInventory(userId, itemKey);
          
          const buyEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('✅ Purchase Successful')
            .setDescription(`You bought **${item.emoji} ${item.name}** for **$${item.price}**!`)
            .setTimestamp();
          await interaction.reply({ embeds: [buyEmbed] });
          break;

        case 'inventory':
          const inventory = getInventory(userId);
          const inventoryEmbed = new EmbedBuilder()
            .setColor('#9932cc')
            .setTitle('🎒 Your Inventory')
            .setTimestamp();
          
          if (Object.keys(inventory).length === 0) {
            inventoryEmbed.setDescription('Your inventory is empty!');
          } else {
            let description = '';
            for (const [itemKey, quantity] of Object.entries(inventory)) {
              const item = shopItems[itemKey];
              description += `${item.emoji} **${item.name}** x${quantity}\n`;
            }
            inventoryEmbed.setDescription(description);
          }
          
          await interaction.reply({ embeds: [inventoryEmbed] });
          break;

        case 'give':
          const targetUser = interaction.options.getUser('user');
          const amount = interaction.options.getInteger('amount');
          const senderBalance = getBalance(userId);
          
          if (targetUser.id === userId) {
            await interaction.reply('❌ You cannot give money to yourself!');
            return;
          }
          
          if (senderBalance < amount) {
            await interaction.reply(`❌ You don't have enough money! You have **$${senderBalance}** but tried to give **$${amount}**.`);
            return;
          }
          
          setBalance(userId, senderBalance - amount);
          setBalance(targetUser.id, getBalance(targetUser.id) + amount);
          
          const giveEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('💸 Money Transfer')
            .setDescription(`You gave **$${amount}** to ${targetUser}!`)
            .setTimestamp();
          await interaction.reply({ embeds: [giveEmbed] });
          break;

        case 'wallet':
          const walletBalance = getBalance(userId);
          const walletInventory = getInventory(userId);
          const itemCount = Object.values(walletInventory).reduce((sum, count) => sum + count, 0);
          
          const walletEmbed = new EmbedBuilder()
            .setColor('#ffd700')
            .setTitle('👛 Wallet Details')
            .addFields(
              { name: '💰 Balance', value: `$${walletBalance}`, inline: true },
              { name: '🎒 Items', value: `${itemCount} items`, inline: true },
              { name: '📊 Net Worth', value: `$${walletBalance}`, inline: true }
            )
            .setTimestamp();
          await interaction.reply({ embeds: [walletEmbed] });
          break;

        case 'pay':
          const payUser = interaction.options.getUser('user');
          const payAmount = interaction.options.getInteger('amount');
          const payerBalance = getBalance(userId);
          
          if (payUser.id === userId) {
            await interaction.reply('❌ You cannot pay yourself!');
            return;
          }
          
          if (payerBalance < payAmount) {
            await interaction.reply(`❌ Insufficient funds! You have **$${payerBalance}** but tried to pay **$${payAmount}**.`);
            return;
          }
          
          setBalance(userId, payerBalance - payAmount);
          setBalance(payUser.id, getBalance(payUser.id) + payAmount);
          
          const payEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('💳 Payment Successful')
            .setDescription(`You paid **$${payAmount}** to ${payUser}!`)
            .setTimestamp();
          await interaction.reply({ embeds: [payEmbed] });
          break;

        case 'leaderboard':
          const sortedUsers = Array.from(userBalances.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
          
          const leaderboardEmbed = new EmbedBuilder()
            .setColor('#ffd700')
            .setTitle('🏆 Leaderboard - Richest Users')
            .setTimestamp();
          
          if (sortedUsers.length === 0) {
            leaderboardEmbed.setDescription('No users found!');
          } else {
            let description = '';
            for (let i = 0; i < sortedUsers.length; i++) {
              const [id, balance] = sortedUsers[i];
              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
              description += `${medal} <@${id}> - $${balance}\n`;
            }
            leaderboardEmbed.setDescription(description);
          }
          
          await interaction.reply({ embeds: [leaderboardEmbed] });
          break;

        case 'coinflip':
          const betAmount = interaction.options.getInteger('amount');
          const choice = interaction.options.getString('choice');
          const userBal = getBalance(userId);
          
          if (userBal < betAmount) {
            await interaction.reply(`❌ You don't have enough money! You need **$${betAmount}** but only have **$${userBal}**.`);
            return;
          }
          
          const flip = Math.random() < 0.5 ? 'heads' : 'tails';
          const won = choice === flip;
          
          if (won) {
            setBalance(userId, userBal + betAmount);
            const winEmbed = new EmbedBuilder()
              .setColor('#00ff00')
              .setTitle('🪙 Coinflip - You Won!')
              .setDescription(`The coin landed on **${flip}**!\nYou won **$${betAmount}**!`)
              .setTimestamp();
            await interaction.reply({ embeds: [winEmbed] });
          } else {
            setBalance(userId, userBal - betAmount);
            const loseEmbed = new EmbedBuilder()
              .setColor('#ff0000')
              .setTitle('🪙 Coinflip - You Lost!')
              .setDescription(`The coin landed on **${flip}**!\nYou lost **$${betAmount}**!`)
              .setTimestamp();
            await interaction.reply({ embeds: [loseEmbed] });
          }
          break;

        case 'gamble':
          const gambleAmount = interaction.options.getInteger('amount');
          const gamblerBalance = getBalance(userId);
          
          if (gamblerBalance < gambleAmount) {
            await interaction.reply(`❌ You don't have enough money! You need **$${gambleAmount}** but only have **$${gamblerBalance}**.`);
            return;
          }
          
          const multiplier = Math.random();
          let winnings = 0;
          let result = '';
          
          if (multiplier < 0.4) {
            // Lose
            setBalance(userId, gamblerBalance - gambleAmount);
            result = `You lost **$${gambleAmount}**!`;
          } else if (multiplier < 0.7) {
            // Win small
            winnings = Math.floor(gambleAmount * 1.5);
            setBalance(userId, gamblerBalance + winnings - gambleAmount);
            result = `You won **$${winnings}**!`;
          } else if (multiplier < 0.95) {
            // Win big
            winnings = Math.floor(gambleAmount * 2);
            setBalance(userId, gamblerBalance + winnings - gambleAmount);
            result = `You won **$${winnings}**!`;
          } else {
            // Jackpot
            winnings = Math.floor(gambleAmount * 5);
            setBalance(userId, gamblerBalance + winnings - gambleAmount);
            result = `🎉 JACKPOT! You won **$${winnings}**!`;
          }
          
          const gambleEmbed = new EmbedBuilder()
            .setColor(winnings > 0 ? '#00ff00' : '#ff0000')
            .setTitle('🎰 Gamble Result')
            .setDescription(result)
            .setTimestamp();
          await interaction.reply({ embeds: [gambleEmbed] });
          break;

        case 'slots':
          const slotBet = interaction.options.getInteger('amount');
          const slotBalance = getBalance(userId);
          
          if (slotBalance < slotBet) {
            await interaction.reply(`❌ You don't have enough money! You need **$${slotBet}** but only have **$${slotBalance}**.`);
            return;
          }
          
          const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎'];
          const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
          const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
          const slot3 = symbols[Math.floor(Math.random() * symbols.length)];
          
          let slotWin = 0;
          if (slot1 === slot2 && slot2 === slot3) {
            if (slot1 === '💎') slotWin = slotBet * 10;
            else if (slot1 === '⭐') slotWin = slotBet * 5;
            else slotWin = slotBet * 3;
          } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
            slotWin = slotBet;
          }
          
          const netGain = slotWin - slotBet;
          setBalance(userId, slotBalance + netGain);
          
          const slotsEmbed = new EmbedBuilder()
            .setColor(netGain > 0 ? '#00ff00' : '#ff0000')
            .setTitle('🎰 Slot Machine')
            .setDescription(`${slot1} ${slot2} ${slot3}\n\n${netGain > 0 ? `You won **$${slotWin}**!` : `You lost **$${slotBet}**!`}`)
            .setTimestamp();
          await interaction.reply({ embeds: [slotsEmbed] });
          break;

        case 'beg':
          const begCooldown = 30 * 1000; // 30 seconds
          const lastBeg = begCooldowns.get(userId) || 0;
          
          if (Date.now() - lastBeg < begCooldown) {
            const timeLeft = begCooldown - (Date.now() - lastBeg);
            await interaction.reply(`⏰ You can beg again in **${Math.ceil(timeLeft / 1000)}** seconds!`);
            return;
          }
          
          const begChance = Math.random();
          let begResult = '';
          
          if (begChance < 0.3) {
            begResult = '😔 Nobody gave you anything...';
          } else {
            const begAmount = Math.floor(Math.random() * 50) + 1;
            setBalance(userId, getBalance(userId) + begAmount);
            begResult = `🥺 Someone gave you **$${begAmount}**!`;
          }
          
          begCooldowns.set(userId, Date.now());
          
          const begEmbed = new EmbedBuilder()
            .setColor('#ffff00')
            .setTitle('🤲 Begging')
            .setDescription(begResult)
            .setTimestamp();
          await interaction.reply({ embeds: [begEmbed] });
          break;

        case 'rob-bank':
          const bankCooldown = 2 * 60 * 60 * 1000; // 2 hours
          const lastRob = robCooldowns.get(userId) || 0;
          
          if (Date.now() - lastRob < bankCooldown) {
            const timeLeft = bankCooldown - (Date.now() - lastRob);
            const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
            const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
            await interaction.reply(`⏰ You can rob a bank again in **${hoursLeft}h ${minutesLeft}m**!`);
            return;
          }
          
          const bankSuccess = Math.random() < 0.3; // 30% success rate
          robCooldowns.set(userId, Date.now());
          
          if (bankSuccess) {
            const stolenAmount = Math.floor(Math.random() * 5000) + 1000;
            setBalance(userId, getBalance(userId) + stolenAmount);
            const robEmbed = new EmbedBuilder()
              .setColor('#00ff00')
              .setTitle('🏦 Bank Robbery - Success!')
              .setDescription(`You successfully robbed **$${stolenAmount}** from the bank!`)
              .setTimestamp();
            await interaction.reply({ embeds: [robEmbed] });
          } else {
            const fine = Math.floor(Math.random() * 1000) + 500;
            setBalance(userId, Math.max(0, getBalance(userId) - fine));
            const failEmbed = new EmbedBuilder()
              .setColor('#ff0000')
              .setTitle('🏦 Bank Robbery - Failed!')
              .setDescription(`You got caught and paid a fine of **$${fine}**!`)
              .setTimestamp();
            await interaction.reply({ embeds: [failEmbed] });
          }
          break;

        case 'rob-atm':
          const atmSuccess = Math.random() < 0.6; // 60% success rate
          
          if (atmSuccess) {
            const atmAmount = Math.floor(Math.random() * 500) + 100;
            setBalance(userId, getBalance(userId) + atmAmount);
            const atmEmbed = new EmbedBuilder()
              .setColor('#00ff00')
              .setTitle('🏧 ATM Robbery - Success!')
              .setDescription(`You successfully robbed **$${atmAmount}** from the ATM!`)
              .setTimestamp();
            await interaction.reply({ embeds: [atmEmbed] });
          } else {
            const atmFine = Math.floor(Math.random() * 200) + 100;
            setBalance(userId, Math.max(0, getBalance(userId) - atmFine));
            const atmFailEmbed = new EmbedBuilder()
              .setColor('#ff0000')
              .setTitle('🏧 ATM Robbery - Failed!')
              .setDescription(`You got caught and paid a fine of **$${atmFine}**!`)
              .setTimestamp();
            await interaction.reply({ embeds: [atmFailEmbed] });
          }
          break;

        case 'mines':
          const minesBet = interaction.options.getInteger('amount');
          const minesBalance = getBalance(userId);
          
          if (minesBalance < minesBet) {
            await interaction.reply(`❌ You don't have enough money! You need **$${minesBet}** but only have **$${minesBalance}**.`);
            return;
          }
          
          const mineChance = Math.random();
          if (mineChance < 0.4) {
            // Hit mine
            setBalance(userId, minesBalance - minesBet);
            const mineEmbed = new EmbedBuilder()
              .setColor('#ff0000')
              .setTitle('💣 Mines - Boom!')
              .setDescription(`You hit a mine and lost **$${minesBet}**!`)
              .setTimestamp();
            await interaction.reply({ embeds: [mineEmbed] });
          } else {
            // Safe
            const minesWin = Math.floor(minesBet * 1.8);
            setBalance(userId, minesBalance + minesWin - minesBet);
            const safeEmbed = new EmbedBuilder()
              .setColor('#00ff00')
              .setTitle('💎 Mines - Safe!')
              .setDescription(`You found a gem and won **$${minesWin}**!`)
              .setTimestamp();
            await interaction.reply({ embeds: [safeEmbed] });
          }
          break;

        case 'roulette':
          const rouletteBet = interaction.options.getInteger('amount');
          const rouletteChoice = interaction.options.getString('choice');
          const rouletteBalance = getBalance(userId);
          
          if (rouletteBalance < rouletteBet) {
            await interaction.reply(`❌ You don't have enough money! You need **$${rouletteBet}** but only have **$${rouletteBalance}**.`);
            return;
          }
          
          const rouletteResult = Math.random();
          let rouletteWin = 0;
          let resultColor = '';
          
          if (rouletteResult < 0.02) {
            resultColor = 'green';
            if (rouletteChoice === 'green') rouletteWin = rouletteBet * 35;
          } else if (rouletteResult < 0.51) {
            resultColor = 'red';
            if (rouletteChoice === 'red') rouletteWin = rouletteBet * 2;
          } else {
            resultColor = 'black';
            if (rouletteChoice === 'black') rouletteWin = rouletteBet * 2;
          }
          
          const rouletteNet = rouletteWin - rouletteBet;
          setBalance(userId, rouletteBalance + rouletteNet);
          
          const rouletteEmbed = new EmbedBuilder()
            .setColor(rouletteNet > 0 ? '#00ff00' : '#ff0000')
            .setTitle('🎡 Roulette')
            .setDescription(`The ball landed on **${resultColor}**!\n${rouletteNet > 0 ? `You won **$${rouletteWin}**!` : `You lost **$${rouletteBet}**!`}`)
            .setTimestamp();
          await interaction.reply({ embeds: [rouletteEmbed] });
          break;

        case 'towers':
          const towersBet = interaction.options.getInteger('amount');
          const towersBalance = getBalance(userId);
          
          if (towersBalance < towersBet) {
            await interaction.reply(`❌ You don't have enough money! You need **$${towersBet}** but only have **$towersBalance**.`);
            return;
          }
          
          const floors = 5;
          let currentFloor = 1;
          let towersMultiplier = 1;
          
          for (let i = 0; i < floors; i++) {
            if (Math.random() < 0.7) {
              currentFloor++;
              towersMultiplier += 0.5;
            } else {
              break;
            }
          }
          
          const towersWin = Math.floor(towersBet * towersMultiplier);
          const towersNet = towersWin - towersBet;
          setBalance(userId, towersBalance + towersNet);
          
          const towersEmbed = new EmbedBuilder()
            .setColor(towersNet > 0 ? '#00ff00' : '#ff0000')
            .setTitle('🗼 Towers')
            .setDescription(`You climbed to floor **${currentFloor}**!\n${towersNet > 0 ? `You won **$${towersWin}**!` : `You lost **$${towersBet}**!`}`)
            .setTimestamp();
          await interaction.reply({ embeds: [towersEmbed] });
          break;

        case 'whack':
          const whackBet = interaction.options.getInteger('amount');
          const whackBalance = getBalance(userId);
          
          if (whackBalance < whackBet) {
            await interaction.reply(`❌ You don't have enough money! You need **$${whackBet}** but only have **$${whackBalance}**.`);
            return;
          }
          
          const moles = Math.floor(Math.random() * 10) + 1;
          const whackWin = Math.floor(whackBet * (1 + moles * 0.1));
          const whackNet = whackWin - whackBet;
          setBalance(userId, whackBalance + whackNet);
          
          const whackEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('🔨 Whack-a-Mole')
            .setDescription(`You whacked **${moles}** moles and won **$${whackWin}**!`)
            .setTimestamp();
          await interaction.reply({ embeds: [whackEmbed] });
          break;

        default:
          await interaction.reply('❌ Unknown subcommand!');
      }
    } catch (error) {
      console.error('Error handling interaction:', error);
      await interaction.reply('❌ An error occurred while processing your command.');
    }
  }

  if (interaction.commandName === 'suggestion') {
    if (!interaction.member.permissions.has('ManageGuild')) {
      await interaction.reply('❌ You need the **Manage Server** permission to use this command!');
      return;
    }

    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    try {
      let response;

      switch (subcommand) {
        case 'status':
          const status = interaction.options.getString('status');
          response = await setStatus(guildId, status);
          break;

        case 'channel':
          const channel = interaction.options.getChannel('channel');
          response = await setChannel(guildId, channel);
          break;

        case 'appch':
          const appChannel = interaction.options.getChannel('channel');
          response = await setApprovedChannel(guildId, appChannel);
          break;

        case 'rejch':
          const rejChannel = interaction.options.getChannel('channel');
          response = await setRejectedChannel(guildId, rejChannel);
          break;

        case 'approve':
          const approveChannel = interaction.options.getChannel('channel');
          const approveMessageId = interaction.options.getString('message_id');
          const approveReason = interaction.options.getString('reason');
          response = await approveSuggestion(interaction.member, approveChannel, approveMessageId, approveReason);
          break;

        case 'reject':
          const rejectChannel = interaction.options.getChannel('channel');
          const rejectMessageId = interaction.options.getString('message_id');
          const rejectReason = interaction.options.getString('reason');
          response = await rejectSuggestion(interaction.member, rejectChannel, rejectMessageId, rejectReason);
          break;

        case 'staffadd':
          const addRole = interaction.options.getRole('role');
          response = await addStaffRole(guildId, addRole);
          break;

        case 'staffremove':
          const removeRole = interaction.options.getRole('role');
          response = await removeStaffRole(guildId, removeRole);
          break;

        default:
          response = '❌ Unknown subcommand!';
      }

      await interaction.reply({ content: response, ephemeral: true });
    } catch (error) {
      console.error('Error handling suggestion command:', error);
      await interaction.reply({ content: '❌ An error occurred while processing your command.', ephemeral: true });
    }
  }

  if (interaction.commandName === 'suggest') {
    const settings = getGuildSettings(interaction.guild.id);

    if (!settings.suggestions.enabled) {
      await interaction.reply({ content: '❌ The suggestion system is disabled in this server!', ephemeral: true });
      return;
    }

    if (!settings.suggestions.channel_id) {
      await interaction.reply({ content: '❌ No suggestion channel has been configured!', ephemeral: true });
      return;
    }

    const suggestionChannel = interaction.guild.channels.cache.get(settings.suggestions.channel_id);
    if (!suggestionChannel) {
      await interaction.reply({ content: '❌ The configured suggestion channel no longer exists!', ephemeral: true });
      return;
    }

    const suggestion = interaction.options.getString('suggestion');

    try {
      const suggestionEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('💡 New Suggestion')
        .setDescription(suggestion)
        .addFields(
          { name: 'Suggested by', value: interaction.user.toString(), inline: true },
          { name: 'Status', value: '⏳ Pending', inline: true }
        )
        .setTimestamp()
        .setFooter({ text: `User ID: ${interaction.user.id}` });

      const message = await suggestionChannel.send({ embeds: [suggestionEmbed] });
      await message.react('👍');
      await message.react('👎');

      await interaction.reply({ content: '✅ Your suggestion has been submitted successfully!', ephemeral: true });
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      await interaction.reply({ content: '❌ An error occurred while submitting your suggestion.', ephemeral: true });
    }
  }
});

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
client.login(TOKEN);
