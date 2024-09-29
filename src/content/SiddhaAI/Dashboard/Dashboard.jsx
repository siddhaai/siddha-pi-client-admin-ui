import React from 'react';
import IntakeGraph from './IntakeGraph';
// import PendingGraph from './PendingGraph';
// import Reports from './Reports';
import Table from './Table';
import { Grid } from '@mui/material';
// import PageTitleWrapper from 'src/components/PageTitleWrapper';
// import PageHeader from './PageHeader';

export default function Dashboard() {
  return (
    <>
      {/* <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper> */}

      {/* Grid container for the three graphs */}
      <Grid
        container
        spacing={3}
        p={3}
        sx={{ display: 'flex', justifyContent: 'center' }}
      >
        <Grid item xs={12} md={4}>
          {/* Each graph is placed in a grid item taking up one-third width on medium to large screens */}
          <IntakeGraph />
        </Grid>
        {/* <Grid item xs={12} md={4}>
          <PendingGraph />
        </Grid> */}
        {/* <Grid item xs={12} md={4}>
          <Reports />
        </Grid> */}
      </Grid>

      {/* Grid container for the table */}
      <Grid container spacing={3} p={3}>
        {/* Table takes the full width */}
        <Grid item xs={12}>
          <Table />
        </Grid>
      </Grid>
    </>
  );
}

// import React from 'react';
// import IntakeGraph from './IntakeGraph'; // Assuming you renamed PatientIntakeSuccessCount to IntakeGraph
// import { Grid } from '@mui/material';
// import Table from './Table';

// export default function Dashboard() {
//   return (
//     <>
//       {/* Grid container for the graphs */}
//       <Grid
//         container
//         spacing={3}
//         p={3}
//         sx={{ display: 'flex', justifyContent: 'center' }}
//       >
//         <Grid item xs={12} md={6}>
//           {/* Each graph is placed in a grid item taking up full width on mobile and half on medium screens */}
//           <IntakeGraph />
//         </Grid>
//       </Grid>

//       {/* Grid container for the table */}
//       <Grid container spacing={3} p={3}>
//         {/* Table takes the full width */}
//         <Grid item xs={12}>
//           <Table /> {/* Assuming you have a Table component */}
//         </Grid>
//       </Grid>
//     </>
//   );
// }
