const TelegramBot = require('node-telegram-bot-api');
const token = '8457458219:AAFGu8lGlOqAxHm8-Ww2qCcs2xpTfyf2OeA'; // ← apna bot token yaha dalna
const ADMIN_CHAT_ID = 6652220800; // ← apna admin Telegram chat id

const bot = new TelegramBot(token, { polling: true });

// /start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Welcome! NFT payment screenshot bhejo yaha.');
});

// Screenshot receive aur admin ko send karna
bot.on('photo', (msg) => {
  const userId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name;
  const fileId = msg.photo[msg.photo.length - 1].file_id;

  // User ko acknowledge message
  bot.sendMessage(userId, 'Screenshot received! Admin approval pending ✅');

  // Admin ke liye screenshot send with inline buttons
  bot.sendPhoto(ADMIN_CHAT_ID, fileId, {
    caption: `🧾 New Payment Screenshot from @${username}`,
    reply_markup: {
      inline_keyboard: [[
        { text: "✅ Approve", callback_data: `approve_${userId}` },
        { text: "❌ Reject", callback_data: `reject_${userId}` }
      ]]
    }
  });
});

// Inline button click handler (approve/reject)
bot.on('callback_query', (callbackQuery) => {
  const data = callbackQuery.data;
  const message = callbackQuery.message;

  // Split action and user id
  const [action, userId] = data.split('_');

  if(action === 'approve'){
    bot.editMessageText('✅ Payment Approved', {
      chat_id: message.chat.id,
      message_id: message.message_id
    });
    bot.sendMessage(userId, '✅ Your payment has been approved!');
  } 
  else if(action === 'reject'){
    bot.editMessageText('❌ Payment Rejected', {
      chat_id: message.chat.id,
      message_id: message.message_id
    });
    bot.sendMessage(userId, '❌ Your payment has been rejected!');
  }

  console.log(`Admin action: ${action.toUpperCase()} for user ${userId}`);
});