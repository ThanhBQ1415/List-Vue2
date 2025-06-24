import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// 1. Định nghĩa schema cho từng model
const userSchema = new mongoose.Schema({
  userId: Number,
  fullName: String,
  email: String,
  password: String,
  avatarUrl: String,
  createdAt: Date,
});

const projectSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  ownerId: Number,
  createdAt: Date,
});

const statusSchema = new mongoose.Schema({
  statusId: Number,
  name: String,
  displayOrder: Number,
  projectId: Number,
});

const labelSchema = new mongoose.Schema({
  labelId: Number,
  name: String,
  color: String,
});

const taskSchema = new mongoose.Schema({
  taskId: Number,
  title: String,
  description: String,
  startDate: Date,
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date,
  creatorId: Number,
  assigneeId: Number,
  statusId: Number,
  projectId: Number,
});

const commentSchema = new mongoose.Schema({
  commentId: Number,
  content: String,
  createdAt: Date,
  userId: Number,
  taskId: Number,
});

const checklistItemSchema = new mongoose.Schema({
  itemId: Number,
  title: String,
  isCompleted: Boolean,
  taskId: Number,
});

// 2. Tạo model
const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);
const Status = mongoose.model('Status', statusSchema);
const Label = mongoose.model('Label', labelSchema);
const Task = mongoose.model('Task', taskSchema);
const Comment = mongoose.model('Comment', commentSchema);
const ChecklistItem = mongoose.model('ChecklistItem', checklistItemSchema);

// 3. Dữ liệu mẫu
const users = [
  { userId: 1, fullName: 'Admin User', email: 'admin@example.com', password: '123456', avatarUrl: '', createdAt: new Date() },
  { userId: 2, fullName: 'John Doe', email: 'john@example.com', password: '123456', avatarUrl: '', createdAt: new Date() },
  { userId: 3, fullName: 'Jane Smith', email: 'jane@example.com', password: '123456', avatarUrl: '', createdAt: new Date() },
  { userId: 4, fullName: 'Alice Nguyen', email: 'alice@example.com', password: '123456', avatarUrl: '', createdAt: new Date() },
  { userId: 5, fullName: 'Bob Tran', email: 'bob@example.com', password: '123456', avatarUrl: '', createdAt: new Date() },
];

const projects = [
  { id: 1, name: 'Default Project', description: 'Default project for testing', ownerId: 1, createdAt: new Date() },
  { id: 2, name: 'Website Redesign', description: 'Redesign the company website', ownerId: 2, createdAt: new Date() },
  { id: 3, name: 'Mobile App', description: 'Develop a new mobile app', ownerId: 3, createdAt: new Date() },
];

const statuses = [
  { statusId: 1, name: 'To Do', displayOrder: 1, projectId: 1 },
  { statusId: 2, name: 'In Progress', displayOrder: 2, projectId: 1 },
  { statusId: 3, name: 'Done', displayOrder: 3, projectId: 1 },
  { statusId: 4, name: 'To Do', displayOrder: 1, projectId: 2 },
  { statusId: 5, name: 'In Progress', displayOrder: 2, projectId: 2 },
  { statusId: 6, name: 'Done', displayOrder: 3, projectId: 2 },
  { statusId: 7, name: 'To Do', displayOrder: 1, projectId: 3 },
  { statusId: 8, name: 'In Progress', displayOrder: 2, projectId: 3 },
  { statusId: 9, name: 'Done', displayOrder: 3, projectId: 3 },
];

const labels = [
  { labelId: 1, name: 'Bug', color: '#ff0000' },
  { labelId: 2, name: 'Feature', color: '#00ff00' },
  { labelId: 3, name: 'Enhancement', color: '#0000ff' },
  { labelId: 4, name: 'Urgent', color: '#ff9900' },
  { labelId: 5, name: 'Low Priority', color: '#cccccc' },
];

const tasks = [
  {
    taskId: 1,
    title: 'Sample Task',
    description: 'This is a sample task',
    startDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 1,
    assigneeId: 2,
    statusId: 1,
    projectId: 1,
  },
  {
    taskId: 2,
    title: 'Fix login bug',
    description: 'Users cannot log in with Google',
    startDate: new Date(),
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 2,
    assigneeId: 3,
    statusId: 2,
    projectId: 1,
  },
  {
    taskId: 3,
    title: 'Design new logo',
    description: 'Create a modern logo for the app',
    startDate: new Date(),
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 3,
    assigneeId: 4,
    statusId: 1,
    projectId: 2,
  },
  {
    taskId: 4,
    title: 'Implement push notifications',
    description: 'Add push notification support',
    startDate: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 4,
    assigneeId: 5,
    statusId: 4,
    projectId: 2,
  },
  {
    taskId: 5,
    title: 'Write unit tests',
    description: 'Increase test coverage to 80%',
    startDate: new Date(),
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 5,
    assigneeId: 1,
    statusId: 7,
    projectId: 3,
  },
];

const comments = [
  { commentId: 1, content: 'This is a sample comment', createdAt: new Date(), userId: 2, taskId: 1 },
  { commentId: 2, content: 'I am working on this bug.', createdAt: new Date(), userId: 3, taskId: 2 },
  { commentId: 3, content: 'Logo draft is ready for review.', createdAt: new Date(), userId: 4, taskId: 3 },
  { commentId: 4, content: 'Push notification feature started.', createdAt: new Date(), userId: 5, taskId: 4 },
  { commentId: 5, content: 'Unit tests are important!', createdAt: new Date(), userId: 1, taskId: 5 },
];

const checklistItems = [
  { itemId: 1, title: 'Sample checklist item', isCompleted: false, taskId: 1 },
  { itemId: 2, title: 'Check Google login', isCompleted: true, taskId: 2 },
  { itemId: 3, title: 'Upload logo to drive', isCompleted: false, taskId: 3 },
  { itemId: 4, title: 'Test push on Android', isCompleted: false, taskId: 4 },
  { itemId: 5, title: 'Write tests for API', isCompleted: true, taskId: 5 },
  { itemId: 6, title: 'Review code', isCompleted: false, taskId: 5 },
];

// 4. Hàm seed data
async function seed() {
  await mongoose.connect(process.env.DB_URL!);

  await User.deleteMany({});
  await Project.deleteMany({});
  await Status.deleteMany({});
  await Label.deleteMany({});
  await Task.deleteMany({});
  await Comment.deleteMany({});
  await ChecklistItem.deleteMany({});

  await User.insertMany(users);
  await Project.insertMany(projects);
  await Status.insertMany(statuses);
  await Label.insertMany(labels);
  await Task.insertMany(tasks);
  await Comment.insertMany(comments);
  await ChecklistItem.insertMany(checklistItems);

  console.log('✅ Seed data completed!');
  await mongoose.disconnect();
}

seed();
