// const prod = false;

// export const ApiUrl = prod
//   ? 'http://ec2-3-221-146-175.compute-1.amazonaws.com:3000'
//   : 'http://ec2-3-221-146-175.compute-1.amazonaws.com:3000';

const prod = false;

export const ApiUrl = prod
  ? 'https://d2m9jx6gy6rjkd.cloudfront.net'
  : 'https://d2m9jx6gy6rjkd.cloudfront.net';

// export const ApiUrl = `http://localhost:3000`;
// export let ApiUrl = `http://192.168.1.6:3000`; // room airtel
// export const ApiUrl = `http://192.168.1.30:3000`; // office airtel
