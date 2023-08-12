import Collection from '../../vendor/@discordjs/collection.min.js';
import io from '../../vendor/socket.io/socket.io.min.js';

export { Collection, io };

export function isUUID(string) {
  const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  return regex.test(string);
}

export function getLevel(xp) {
  const XPTiers = [
    200, 350, 500, 650, 750, 850, 950, 1050, 1150, 1250, 1350, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850,
    1900,
  ];

  let level = 1;
  let treshold = 0;
  while (xp >= treshold + XPTiers[level - 1]) {
    treshold += XPTiers[level - 1];
    level++;
  }
  const total = XPTiers.reduce((a, b) => a + b, 0);
  if (xp > total) level += Math.floor((xp - treshold) / 2000);
  return level;
}
