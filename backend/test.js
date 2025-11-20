/**
 * Simple test suite for the Fake User Generator
 */

const assert = require('assert');
const FakeUserService = require('./services/fakeUserService');
const TaskStore = require('./models/taskStore');

console.log('🧪 Running tests...\n');

// Test 1: Fake User Service - Generate User Data
console.log('Test 1: Generate Fake User Data');
const userService = new FakeUserService();
const userData = userService.generateFakeUserData();

assert(userData.username, 'Username should be generated');
assert(userData.email, 'Email should be generated');
assert(userData.email.includes('@'), 'Email should contain @');
assert(userData.firstName, 'First name should be generated');
assert(userData.lastName, 'Last name should be generated');
assert(userData.password.length >= 12, 'Password should be at least 12 characters');
assert(userData.phone.startsWith('+1'), 'Phone should start with +1');
console.log('✅ Pass - User data generated correctly\n');

// Test 2: Task Store - Add and Get Task
console.log('Test 2: Task Store Operations');
const taskStore = new TaskStore();
const testTask = {
  id: 'test-123',
  targetUrl: 'https://example.com',
  userCount: 10,
  createdUsersCount: 0,
  status: 'pending',
  createdAt: new Date().toISOString(),
  logs: [],
  errors: []
};

taskStore.addTask(testTask);
const retrievedTask = taskStore.getTask('test-123');
assert(retrievedTask.id === 'test-123', 'Task should be retrievable by ID');
assert(retrievedTask.targetUrl === 'https://example.com', 'Task URL should match');
console.log('✅ Pass - Task storage works correctly\n');

// Test 3: Task Store - Update Task
console.log('Test 3: Update Task');
retrievedTask.status = 'running';
taskStore.updateTask(retrievedTask);
const updatedTask = taskStore.getTask('test-123');
assert(updatedTask.status === 'running', 'Task status should be updated');
console.log('✅ Pass - Task update works correctly\n');

// Test 4: Task Store - Add Log
console.log('Test 4: Add Task Log');
taskStore.addLog('test-123', 'Test log message');
const taskWithLog = taskStore.getTask('test-123');
assert(taskWithLog.logs.length === 1, 'Log should be added');
assert(taskWithLog.logs[0].message === 'Test log message', 'Log message should match');
console.log('✅ Pass - Task logging works correctly\n');

// Test 5: Task Store - Increment Created Users
console.log('Test 5: Increment Created Users');
taskStore.incrementCreatedUsers('test-123');
const taskWithIncrement = taskStore.getTask('test-123');
assert(taskWithIncrement.createdUsersCount === 1, 'Created users count should increment');
console.log('✅ Pass - User count increment works correctly\n');

// Test 6: Task Store - Get All Tasks
console.log('Test 6: Get All Tasks');
const anotherTask = {
  id: 'test-456',
  targetUrl: 'https://example2.com',
  userCount: 5,
  createdUsersCount: 0,
  status: 'pending',
  createdAt: new Date().toISOString(),
  logs: [],
  errors: []
};
taskStore.addTask(anotherTask);
const allTasks = taskStore.getAllTasks();
assert(allTasks.length === 2, 'Should have 2 tasks');
console.log('✅ Pass - Get all tasks works correctly\n');

// Test 7: Task Store - Delete Task
console.log('Test 7: Delete Task');
taskStore.deleteTask('test-456');
const remainingTasks = taskStore.getAllTasks();
assert(remainingTasks.length === 1, 'Should have 1 task after deletion');
assert(!taskStore.getTask('test-456'), 'Deleted task should not exist');
console.log('✅ Pass - Task deletion works correctly\n');

// Test 8: User Service - Extract Links
console.log('Test 8: Extract Links from HTML');
const sampleHTML = `
  <html>
    <body>
      <a href="/page1">Page 1</a>
      <a href="/page2">Page 2</a>
      <a href="https://external.com">External</a>
      <a href="https://example.com/page3">Page 3</a>
    </body>
  </html>
`;
const links = userService.extractLinks(sampleHTML, 'https://example.com');
assert(links.length >= 3, 'Should extract same-origin links');
console.log('✅ Pass - Link extraction works correctly\n');

// Test 9: User Service - Generate Phone Number
console.log('Test 9: Generate Phone Number');
const phone = userService.generatePhoneNumber();
assert(phone.startsWith('+1'), 'Phone should start with +1');
assert(phone.length === 12, 'Phone should be 12 characters (+1 + 10 digits)');
console.log('✅ Pass - Phone generation works correctly\n');

// Test 10: User Service - Generate Random Password
console.log('Test 10: Generate Random Password');
const password = userService.generateRandomPassword();
assert(password.length === 12, 'Password should be 12 characters');
assert(/[A-Z]/.test(password), 'Password should contain uppercase');
assert(/[a-z]/.test(password), 'Password should contain lowercase');
console.log('✅ Pass - Password generation works correctly\n');

console.log('🎉 All tests passed!\n');
console.log('Summary:');
console.log('- 10 tests executed');
console.log('- 10 tests passed');
console.log('- 0 tests failed');
console.log('\n✨ Test suite completed successfully!');
