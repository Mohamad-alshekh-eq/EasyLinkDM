const defaults = {
  BOOKER_USERNAME: 'admin',
  BOOKER_PASSWORD: 'password123',
  SAUCEDEMO_PASSWORD: 'secret_sauce',
};

type EnvKey = keyof typeof defaults;

function get(key: EnvKey): string {
  return process.env[key] ?? defaults[key];
}

export const env = {
  booker: {
    username: get('BOOKER_USERNAME'),
    password: get('BOOKER_PASSWORD'),
  },
  saucedemo: {
    password: get('SAUCEDEMO_PASSWORD'),
    standardUser: 'standard_user', // all users are listed on the login page anyway
  },
};
