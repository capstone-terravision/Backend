import { createUser } from '../services/user.service';

const initialUsers = [
  {
    name: 'Alice Smith',
    email: 'alice@example.com',
    password: 'password1',
  },
  {
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password2',
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    password: 'password3',
  },
  {
    name: 'David Lee',
    email: 'david@example.com',
    password: 'password4',
  },
  {
    name: 'Eva Wilson',
    email: 'eva@example.com',
    password: 'password5',
  },
  {
    name: 'Frank Adams',
    email: 'frank@example.com',
    password: 'password6',
  },
  {
    name: 'Grace Clark',
    email: 'grace@example.com',
    password: 'password7',
  },
  {
    name: 'Henry Taylor',
    email: 'henry@example.com',
    password: 'password8',
  },
  {
    name: 'Ivy Garcia',
    email: 'ivy@example.com',
    password: 'password9',
  },
  {
    name: 'Jack Brown',
    email: 'jack@example.com',
    password: 'password10',
  },
];

const seed = async () => {
  for (const user of initialUsers) {
    await createUser(user);
  }
};

seed();
