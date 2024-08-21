const prod = false;

export let ApiUrl = prod
   ? "https://siddha-pi-001-api.azurewebsites.net/"
   : "http://ec2-3-221-146-175.compute-1.amazonaws.com:3000";

// export let ApiUrl = `http://localhost:3000`;
// export let ApiUrl = `http://192.168.1.7:3000`; // room airtel
// export let ApiUrl = `http://192.168.1.26:4000`; // office airtel
