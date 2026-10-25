const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readCollection = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error(`Error reading ${collection}:`, err);
    return [];
  }
};

const writeCollection = (collection, items) => {
  const filePath = getFilePath(collection);
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8');
};

const matchesQuery = (item, query = {}) => {
  return Object.keys(query).every((key) => {
    if (query[key] && typeof query[key] === 'object' && query[key].$regex) {
      const reg = new RegExp(query[key].$regex, query[key].$options || 'i');
      return reg.test(item[key]);
    }
    return item[key] === query[key];
  });
};

const localDb = {
  find(collection, query = {}) {
    const items = readCollection(collection);
    return items.filter((item) => matchesQuery(item, query));
  },

  findOne(collection, query = {}) {
    const items = readCollection(collection);
    return items.find((item) => matchesQuery(item, query)) || null;
  },

  findById(collection, id) {
    const items = readCollection(collection);
    return items.find((item) => item._id === id || item.id === id) || null;
  },

  create(collection, doc) {
    const items = readCollection(collection);
    const newDoc = {
      _id: doc._id || crypto.randomUUID(),
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.unshift(newDoc);
    writeCollection(collection, items);
    return newDoc;
  },

  findByIdAndUpdate(collection, id, updates) {
    const items = readCollection(collection);
    const index = items.findIndex((item) => item._id === id || item.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeCollection(collection, items);
    return items[index];
  },

  findByIdAndDelete(collection, id) {
    const items = readCollection(collection);
    const index = items.findIndex((item) => item._id === id || item.id === id);
    if (index === -1) return false;

    const [deleted] = items.splice(index, 1);
    writeCollection(collection, items);
    return deleted;
  },

  countDocuments(collection, query = {}) {
    return this.find(collection, query).length;
  },
};

module.exports = localDb;
