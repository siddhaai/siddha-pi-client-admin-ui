import React, { useState, useRef, useEffect } from "react";
import { Formik } from "formik";
import {
  TextField,
  Button,

  Typography,
  Box,
  Checkbox,
  // Step,
  // StepLabel,
  // Stepper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  FormControlLabel,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  // IconButton,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import SignatureCanvas from "react-signature-canvas";
import { Toaster, toast } from "react-hot-toast";
import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";
import { Check as CheckIcon } from "@mui/icons-material";
import { loadStripe } from "@stripe/stripe-js";
import { Container } from "@mui/system";
import { PDFDocument } from "pdf-lib";
import AgreePdf from "../../../../assets/Subscription Agree.pdf";
// import SuccessImage from "../assets/Success.svg";
import AmountSuccess from "../../../../assets/Confirmed.svg";
import ErrorUnAuth from "../../../../assets/ErrorUnauthorized.svg";
import FailImage from "../../../../assets/Failed.svg";
import SiddhaAiLogo from "../../../../assets/applicationlogo.png";
// import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import "./PayMent.css";
import InputAdornment from "@mui/material/InputAdornment";
import { DialogContent } from "@mui/material";
import useAxiosInterceptor from "src/contexts/Interceptor";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import {Grid} from "@mui/material"
// import { useLocation } from "react-router-dom";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// Initialize Stripe.js with your public key
const stripePromise = loadStripe(
  "pk_test_51P4orU04OIyeSYNW4vcJ3F8V8ZzKE8lRXRQrzHOGKCx74A40LXbNtNBwu9B736WE3vZeYm3D7UnoN8hZ5OItL3mF009Od3atjW"
);

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(000) 000-0000"
      definitions={{
        0: /[0-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite={false}
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

// Validation schema using Yup
// const validationSchema = Yup.object({
//   firstName: Yup.string()
//     .required("First Name is required")
//     .min(3, "First Name must be at least 3 characters")
//     .max(35, "First Name cannot be more than 35 characters")
//     .matches(/^[A-Za-z]*$/, "First Name must only contain letters"),
//   lastName: Yup.string()
//     .required("Last Name is required")
//     .min(3, "Last Name must be at least 3 characters")
//     .max(35, "Last Name cannot be more than 35 characters")
//     .matches(/^[A-Za-z]*$/, "Last Name must only contain letters"),
//   practicename: Yup.string()
//     .required("Practice Name is required")
//     .min(3, "Practice Name must be at least 3 characters")
//     .max(35, "Practice Name cannot be more than 35 characters")
//     .matches(/^[a-zA-Z\s]+$/, "Practice Name must only contain letters"),
//   // email: Yup.string().email("Invalid email").required("Email is required"),
//  email: Yup.string()
//   .required("Email is required")
//   .matches(
//     /^(?!.*\.\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/,
//     "Invalid email address"
//   ),

//   npi: Yup.string()
//     .required("NPI Number is required")
//     .matches(/^\d{10}$/, "NPI Number must be a 10-digit number"),

//   mobile: Yup.string()
//     .required("Mobile number is required")
//     .min(14, "Mobile number must be a 10-digit number")
//     .matches(
//       /^\([2-9]\d{2}\) \d{3}-\d{4}$/,
//       "Mobile number must be in the format (XXX) XXXX-XXX and cannot start with 0 or 1"
//     ),
//   emr: Yup.string().required("Please select your EMR"),
//   nofprovider: Yup.number()
//     .required("Number of Providers is required")
//     .min(1, "Number of Providers must be at least 1")
//     .max(500, "Number of Providers cannot be more than 500"),
// });

const selectedPlanName = sessionStorage.getItem("selectedPlanName");

const calculateTrialEndDate = () => {
  const startDate = new Date(); // Current date
  const endDate = new Date(startDate); // Copy of current date
  endDate.setDate(startDate.getDate() + 89); // Adds 90 days to the current date
  return endDate; // Returns the raw Date object
};

// Helper function to format date as MMM-DD-YYYY
const formatDate = (date) => {
  if (!(date instanceof Date)) return ""; // Handle case where date is not a valid Date object
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${day}-${year}`; // Return the formatted string
};

// Function to calculate prorated amount and dates
const calculateProratedAmount = (monthlyCost, trialEndDate) => {
  if (isNaN(monthlyCost) || monthlyCost <= 0) {
    return {
      proratedAmount: "0.00",
      startDate: "",
      endDate: "",
    };
  }

  // Get the last day of the month
  const lastDayOfMonth = new Date(
    trialEndDate.getFullYear(),
    trialEndDate.getMonth() + 1,
    0
  ); // Last day of the month
  const totalDaysInMonth = lastDayOfMonth.getDate(); // Total days in the month of trial end date
  const remainingDays = totalDaysInMonth - trialEndDate.getDate() ; // Remaining days from the trial end date to the end of the month

  // Calculate prorated amount
  // const remainingDays += 1;
  const proratedAmount = (monthlyCost / totalDaysInMonth) * remainingDays;

  return {
    proratedAmount: proratedAmount.toFixed(2),
    startDate: formatDate(trialEndDate), // Format the start date for rendering
    endDate: formatDate(lastDayOfMonth), // Format the end date for rendering
  };
};

// Function to calculate the first day of the next month
const calculateNextMonthFirstDay = (date) => {
   const nextMonthFirstDay = new Date(date.getFullYear(), 
   date.getMonth() + 1, 1); 
   return formatDate(nextMonthFirstDay); 
  };

// Fetch the trial end date (90 days from today) and format it
const trialEndDate = calculateTrialEndDate(); // Get the trial end date

// Retrieve the CostPerMonth value from sessionStorage
let costPerMonthString = sessionStorage.getItem("CostPerMonth");

// Check if the value is null or undefined before processing
if (costPerMonthString === null || costPerMonthString === undefined) {
  console.error("CostPerMonth is not found in sessionStorage");
  // Default to 0 if CostPerMonth is not available
  costPerMonthString = "0";
}

// Remove any non-numeric characters (e.g., "$") and convert to float
let monthlyCost = parseFloat(costPerMonthString.replace(/[^\d.-]/g, ""));

// Ensure that monthlyCost is a valid number and default to 0 if not
monthlyCost = isNaN(monthlyCost) ? 0 : monthlyCost;

// Calculate prorated amount and dates
const { startDate: proratedStartDate, endDate: proratedEndDate } =
  calculateProratedAmount(monthlyCost, trialEndDate);

  // Calculate the first day of the next month after the prorated end date
  const nextMonthFirstDay = calculateNextMonthFirstDay(new Date(proratedEndDate));

// Create the message for displaying the prorated charge
// const proratedMessage = ` ${proratedStartDate} to ${proratedEndDate} will be charged, after which Subscription charges will be billed monthly.`;

// Log or display the message
// console.log(proratedMessage);

const CompanyName = "Siddha AI";
const ApplicationVersion = "0.0.4";
const SubscriptionResult = ({
  isLoading,
  handlePayment,
  paymentStatus,
  subscriptionMessage,
  handleSubscription,
  subscriptionFailMessage,
  totalProviders,
  price,
  totalAmountCard,
}) => (
  <>
    {paymentStatus ? (
      subscriptionMessage && !isLoading ? (
        // Display success card with illustration if subscription is successful and loading is false
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: "100vh", px: 2 }}
        >
          <Grid item size={{ xs: 12, sm: 8, md: 6, lg: 4 }} sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
            <Card sx={{ borderRadius: 3, boxShadow: 5, overflow: "hidden" }}>
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <Typography
                  variant="h5"
                  color="#109fb3"
                  sx={{ fontWeight: 600 }}
                >
                  Payment Successful!
                </Typography>
                <Grid container spacing={2} sx={{ mt: 3, mb: 2 }}>
                  <Grid
                    item
                    size={{ xs: 12, sm: 12}}
                    sx={{
                      backgroundImage: `url(${AmountSuccess})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: { xs: "150px", sm: "200px", md: "250px" },
                      borderRadius: 2,
                    }}
                  />
                </Grid>
                <Typography
                  sx={{ mt: 2, fontSize: { xs: "0.9rem", sm: "1rem" } }}
                >
                  {subscriptionMessage}

                  <p>Thank you for choosing us!</p>
                  {/* <Button
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(to right, #2ca6af, #109fb3, #0090b8, #0090b8, #0488b9)",
                    }}
                  >
                    <a
                      href="/"
                      style={{ color: "white", textDecoration: "none" }}
                    >
                      Ok
                    </a>
                  </Button> */}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        // Show loading or subscribe button when subscriptionMessage is not available
        <>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: "100vh", px: { xs: 2, sm: 3 } }}
          >
            <Grid item xs={12} sm={10} md={8} lg={6}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 5,
                  mx: "auto",
                  width: { xs: "100%", sm: "90%", md: "80%" }, // Responsive width
                  maxWidth: 800, // Limit maximum width for better visuals
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 }, textAlign: "center" }}>
                  {/* Card Title */}
                  <Typography
                    variant="h5"
                    color="#109fb3"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      fontSize: { xs: "1.5rem", sm: "1.75rem" },
                    }}
                  >
                    Order Summary
                  </Typography>

                  {/* Order Summary Table */}
                  <Table
                    sx={{
                      backgroundColor: "#f9f9f9",
                      borderRadius: 2,
                      boxShadow: 1,
                      overflow: "hidden",
                      mb: 2,
                    }}
                    size="small"
                    aria-label="order summary table"
                  >
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
                          Customer Name
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          {`${sessionStorage
                            .getItem("firstname")
                            .toUpperCase()} ${sessionStorage
                            .getItem("lastname")
                            .toUpperCase()}`}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Paid to
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          SIDDHA PI
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Plan Type
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          {selectedPlanName}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Plan Cost
                        </TableCell>
                        <TableCell  sx={{ textAlign: "right" }}>
                        <Typography component="span">
                          ${price}
                        </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Providers
                        </TableCell>
                        <TableCell  sx={{ textAlign: "right" }}>
<Typography component="span">                        
                          {totalProviders}
</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "#109fb3" }}
                        >
                          Promotional Offer
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            color: "#109fb3",
                            textAlign: "right",
                          }}
                        >
                        <Typography component="span">
                          {`${sessionStorage.getItem("PromotionalCostAmount")}`}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Monthly Total
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          <Typography component="span">
                            {`${sessionStorage.getItem("TotalCostPerMonth")}`}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Onetime Client Setup Fee
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          <Typography component="span">${500}</Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  {/* Note */}
                  <Box sx={{ textAlign: "left", mt: 2 }}>
                    <Typography variant="body1" color="error">
                      Note:
                      <ul>
                        <li>
                          <Typography
                            sx={{
                              fontSize: { xs: "0.9rem", sm: "1rem" },
                            }}
                          >
                            One-time set-up fee for Siddha PI product purchase
                            <strong> $500</strong> is charged now.
                          </Typography>
                        </li>
                        <li>
                          <Typography
                            sx={{
                              fontSize: { xs: "0.9rem", sm: "1rem" },
                            }}
                          >
                            A subscription fee will be charged once the trial
                            period ends.
                          </Typography>
                        </li>
                      </ul>
                    </Typography>
                  </Box>

                  {/* Pay Button */}
                  {/* <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            fontSize: { xs: "0.9rem", sm: "1rem" },
            fontWeight: 600,
            color: "white",
            background:
                                          "linear-gradient(to right, #2ca6af, #109fb3, #0090b8, #0090b8, #0488b9)",
            "&:hover": {
              // backgroundColor: "success.dark",
              transform: "scale(1.02)",
              transition: "all 0.3s ease",
            },
          }}
          onClick={handleSubscription}
        >
          {isLoading ? (
            <CircularProgress color="inherit" size={30} />
          ) : (
            `Pay $${totalAmountCard}`
          )}
        </Button> 
        
                      <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Free Trial Period</TableCell>
                <TableCell>
                  90 days
                  <Typography variant="body2" color="textSecondary">
                    {`${formatDate(new Date())} - ${formatDate(trialEndDate)}`}
                  </Typography>
                </TableCell>
              </TableRow>

        
        */}
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      width: "50%",
                      mt: 1.5,
                      py: 1.5,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      fontWeight: 600,
                      color: "white",
                      background:
                        "linear-gradient(to right, #2ca6af, #109fb3, #0090b8, #0090b8, #0488b9)",
                      "&:hover": {
                        transform: "scale(1.02)",
                        transition: "all 0.3s ease",
                      },
                    }}
                    onClick={handleSubscription}
                  >
                    {/* Button Label */}
                    {`Pay $${totalAmountCard}`}
                  </Button>

                  {/* Loading Dialog */}
                  <Dialog
                    open={isLoading}
                    PaperProps={{ sx: { borderRadius: 3 } }}
                  >
                    <DialogContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        p: 3,
                      }}
                    >
                      <CircularProgress color="primary" size={40} />
                      <Typography variant="h6" sx={{ textAlign: "center" }}>
                      Please don't close or refresh this window.
                        <br />
                        Your payment is processing
                      </Typography>
                    </DialogContent>
                  </Dialog>

                  {/* Terms and Conditions */}
                  <Box sx={{ textAlign: "center", pt: 3 }}>
                    <ol
                      style={{
                        textAlign: "left",
                        paddingLeft: 20,
                        margin: 0,
                        listStyle: "decimal",
                      }}
                    >
                      <li>
                        <Typography
                          sx={{
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          }}
                        >
                          {` Your 90-day free trial will start from `}
                          <strong>{ sessionStorage.getItem("trialStartDate") || formatDate(new Date())}</strong>
                          {` till `}
                          <strong>{ sessionStorage.getItem("trialEndDate") || formatDate(trialEndDate)}</strong>.
                        </Typography>
                      </li>
                      {/* <li>
                        <Typography
                          sx={{
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          }}
                        >
                          One-time set-up fee for Siddha PI product purchase -{" "}
                          <strong>$500</strong> is charged now.
                        </Typography>
                      </li> */}
                      <li>
                        <Typography
                          sx={{
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          }}
                        >
                          You will be charged a prorated sum of{" "}
                          <strong>
                            ${sessionStorage.getItem("proratedAmount")}
                          </strong>{" "}
                          from
                          <strong> {sessionStorage.getItem("prorateStartDate")}</strong> {` till `}{" "}
                          <strong>{proratedEndDate}</strong>.
                          {/* {` will be charged, after which Subscription charges will be billed monthly.`} */}
                        </Typography>
                      </li>
                      <li>
                        <Typography
                          sx={{
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          }}
                        >
                          Your subscription will renew on <strong>{nextMonthFirstDay}</strong> for{" "}
                          <strong>{`${sessionStorage.getItem(
                            "TotalCostPerMonth"
                          )} per month,`}</strong>{" "}
                          and you will be billed from the first to fifth day of
                          every month after that.
                          {/* <strong>90-day</strong> free trial. */}
                        </Typography>
                      </li>
                      {/* <li>
                        <Typography
                          sx={{
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          }}
                        >
                          Subscription charges will be debited between the{" "}
                          <strong>
                            1<sup>st</sup> and 5<sup>th</sup>
                          </strong>{" "}
                          day of each month.
                        </Typography>
                      </li> */}
                    </ol>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )
    ) : (
      // Display failure message and retry button when paymentStatus is false
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh", px: 2 }}
      >
        <Grid item size={{ xs: 12, sm: 8, md: 6, lg: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 5, overflow: "hidden" }}>
            <Grid
              item
              sx={{
                backgroundImage: `url(${FailImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "center",
                height: { xs: "200px", sm: "250px", md: "300px" },
                width: "100%",
              }}
            />
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="h5" color="error" sx={{ fontWeight: 600 }}>
                Subscription Failed
              </Typography>
              <Typography
                sx={{ mt: 2, fontSize: { xs: "0.9rem", sm: "1rem" } }}
              >
                {subscriptionFailMessage ||
                  "There was an issue with your subscription. Please try again."}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                color="error"
                sx={{
                  mt: 4,
                  py: 1.5,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  fontWeight: 600,
                  color: "white",
                  "&:hover": {
                    backgroundColor: "error.dark",
                    transform: "scale(1.02)",
                    transition: "all 0.3s ease",
                  },
                }}
                onClick={handlePayment}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )}
    <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
      <footer>
        <Typography
          variant="body2"
          color="textDisabled"
          sx={{ fontWeight: 600 }}
        >
          {" "}
          &copy; {CompanyName} {new Date().getFullYear()}
        </Typography>
        <Typography sx={{ ml: 2 }} variant="body2" color="textDisabled">
          Version {ApplicationVersion}
        </Typography>
      </footer>
    </Box>
  </>
);

export default function Signup() {
  const { axios } = useAxiosInterceptor();
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0); // Track the current step
  const [isAgreed, setIsAgreed] = useState(false); // Agreement checkbox state
  const [signature, setSignature] = useState(""); // Store the signature data URL
  const [isSignatureEmpty, setIsSignatureEmpty] = useState(true); // Track if signature is empty
  const [customerId, setCustomerId] = useState(null); // Track customer ID
  const [selectedPlan, setSelectedPlan] = useState(null); // Track the selected plan
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState(""); // To store the message based on success or failure
  const [subscriptionFailMessage, setSubscriptionFailMessage] = useState(""); // To store the message based on success or failure
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [totalProviders, setTotalProviders] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [expandedOne, setExpandedOne] = useState(true);
  const [price, setPrice] = useState(0);
  const [priceId, setPriceId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponVerified, setCouponVerified] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const [apiResponse, setApiResponse] = useState(null); // Holds the entire API response
  const [isAuthorized, setIsAuthorized] = useState(null); // null: loading, true: valid, false: invalid
  const [errorMessage, setErrorMessage] = useState(""); // Holds the unauthorized message
  const [emrData, setEmrData] = useState([]);
  // Inside your component, set expandedOne to true initially

  useEffect(() => {
    const fetchEmrData = async () => {
      try {
        const response = await axios.get(`/fieldValues/emrSettings`);
        setEmrData(response.data.emrData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmrData();
  }, []);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };
  const handleAccordionChangeOne = () => {
    setExpandedOne(!expandedOne);
  };

  const totalAmountCard = 500;

  const sigPad = useRef(null); // Reference to signature pad
  // const steps = ["Details", "Plan", "Agreement"];

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");

  const [nameError, setNameError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [priceLoading, setPriceLoading] = useState("");
  const [isPayAgreed, setIsPayAgreed] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [showCouponCodeField, setShowCouponCodeField] = useState(false);

  const [plans, setPlans] = useState([]);
  const [couponResponse, setCouponResponse] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [proceedWithoutCoupon, setProceedWithoutCoupon] = useState(false);

  // Fetch subscription plan details
  const fetchPriceCard = async () => {
    setPriceLoading(true); // Start loading animation
    try {
      const response = await axios.get(
        `/subscription_details/get-plan-details`
      );
      // console.log(response.data.data.productDetails);
      const productDetails = response.data.data.productDetails || [];
      setPlans(productDetails); // Set the response data in state
    } catch (err) {
      console.error("Error fetching subscription plans:", err);
    } finally {
      setPriceLoading(false); // Stop loading animation
    }
  };

  useEffect(() => {
    fetchPriceCard();
  }, []);

  // Validate alphabetic characters for Name and Title
  // const validateField = (value, fieldName) => {
  //   if (!value.trim()) {
  //     return `${fieldName} is required`;
  //   }
  //   if (!/^[A-Za-z\s]+$/.test(value)) {
  //     return `${fieldName} should contain only alphabetic characters`;
  //   }
  //   return "";
  // };

  const validateField = (value, fieldName, minLength) => {
    if (!value.trim()) {
      return `${fieldName} is required`;
    }
    if (value.trim().length < minLength) {
      return `${fieldName} must be at least ${minLength} characters long`;
    }
    if (!/^[A-Za-z\s]+$/.test(value)) {
      return `${fieldName} should contain only alphabetic characters`;
    }
    return "";
  };

  // Initial form values state
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    npi: "",
    signature: "",
    mobile: "",
    emr: "",
    practicename: "",
    nofprovider: "",
  });

  // Helper function to update formValues
  const updateFormValues = (newValues) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...newValues, // Merge new values with existing ones
    }));
  };

  const handleCouponCode = async (withoutCoupen) => {
    if (!withoutCoupen) {
      if (!couponCode.trim()) {
        // Open confirmation dialog if coupon code is empty
        setDialogOpen(true);
        return;
      }
    }

    setCouponLoading(true);
    setIsCouponApplied(false); // Reset state before applying
    try {
      const response = await axios.post(
        `/subscription_details/getPromotionCodeAndCalculate`,
        {
          promotionCode: couponCode,
          clientSelectedPrice: sessionStorage.getItem("selectedPlanUnitAmount"),
          NoOfProviders: sessionStorage.getItem("nofprovider"),
        }
      );

      if (response.status === 200 && response.data.success) {
        setCouponResponse(response.data); // Store the coupon response
        sessionStorage.setItem("couponCode", couponCode);
        sessionStorage.setItem(
          "clientSelectedPrice",
          response?.data?.clientSelectedPrice
        );
        sessionStorage.setItem("CostPerMonth", response?.data?.CostPerMonth);
        sessionStorage.setItem(
          "PromotionalCostAmount",
          response?.data?.PromotionalCostAmount
        );
        sessionStorage.setItem(
          "TotalCostPerMonth",
          response?.data?.TotalCostPerMonth
        );
        sessionStorage.setItem(
          "proratedAmount",
          response?.data?.prorated_Amount
        );
        sessionStorage.setItem("prorateStartDate",response?.data?.prorate_amount_start_date);
        sessionStorage.setItem("trailStartDate",response?.data?.trial_start);
        sessionStorage.setItem("trailEndDate",response?.data?.trial_end);


        setCouponVerified(true);
        setIsCouponApplied(true); // Show success tick icon
        // toast.success(response.data.message);
      } else {
        toast.error(
          response.data.message || "Invalid or inactive promotion code."
        );
      }
    } catch (err) {
      if (err.response) {
        console.error("Error response:", err.response);
        toast.error(
          err.response.data.message || "Something went wrong. Please try again."
        );
      } else {
        console.error("Error:", err);
        toast.error("Network error or server is not responding.");
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const handleNext = async () => {
    // const withoutCoupen = true;
    if (activeStep === 1){
      await handleCouponCode(true);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handle dialog confirmation
  const handleDialogClose = (confirm) => {
    setDialogOpen(false);
    if (confirm) {
      setProceedWithoutCoupon(true); // Allow enabling the Next button
    } else {
      setProceedWithoutCoupon(false); // Keep state unchanged
    }
  };
  

  // const isNextButtonDisabled =
  //   !proceedWithoutCoupon && (!isCouponApplied || !selectedPlan);

  const isNextButtonDisabled =
  showCouponCodeField
    ? !proceedWithoutCoupon && (!isCouponApplied || !selectedPlan)
    : !selectedPlan; // Disable "Next" if no plan is selected when showCouponCodeField is false


  // console.log("couponResponse", couponResponse);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Clear Signature
  const handleClearSignature = () => {
    sessionStorage.setItem("sign", "");
    sigPad.current.clear(); // Clear the signature canvas
    setSignature(null); // Reset the saved signature
    updateFormValues({ signature: "" }); // Clear signature in formValues
  };

  // Save Signature
  const handleSaveSignature = () => {
    let hasError = false;

    // Validate Name
    const nameValidation = validateField(name, "Name");
    setNameError(nameValidation);
    if (nameValidation) hasError = true;

    // Validate Title
    const titleValidation = validateField(title, "Title");
    setTitleError(titleValidation);
    if (titleValidation) hasError = true;

    // Check if Signature is empty
    if (sigPad.current && sigPad.current.isEmpty()) {
      setIsSignatureEmpty(true);
      toast.error("Please provide a signature.");
      hasError = true;
    } else {
      setIsSignatureEmpty(false);
    }

    // If no errors, call handlePayment
    if (!hasError) {
      const signatureData = sigPad.current
        .getTrimmedCanvas()
        .toDataURL("image/png");
      sessionStorage.setItem("sign", signatureData);
      sessionStorage.setItem("agreeUserName", name);
      sessionStorage.setItem("agreeTitle", title);

      handlePayment({ name, title, signature: signatureData });
    }
  };

  // Handle Payment
  const handlePayment = async () => {
    const name = `${sessionStorage.getItem(
      "firstname"
    )} ${sessionStorage.getItem("lastname")}`;
    const customerSelectedAmount = sessionStorage.getItem(
      "selectedPlanUnitAmount"
    );
    const ttlProviders = sessionStorage.getItem("nofprovider");
    //  console.log("pID",selectedPriceId || priceId);
    try {
      const response = await axios.post(
        `/subscription_details/create-customer`,
        {
          clientEmail: sessionStorage.getItem("email"),
          clientName: name,
          customerSelectedAmount,
          selectedPriceId: selectedPriceId || priceId,
          totalProviders: ttlProviders,
        }
      );
      // console.log("response",response.data);

      if (response.data.success) {
        console.log("response", response.data);
        const { sessionId, customerId } = response.data;
        setCustomerId(customerId);
        // sessionStorage.setItem("CustomerId", customerId);
        const stripe = await stripePromise;
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });

        if (stripeError) {
          toast.error(stripeError.message);
        } else {
          handleNext();
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const selectedPriceId = sessionStorage.getItem("selectedPlanPriceId");
  if (selectedPriceId) {
    // console.log("Retrieved selected plan price ID:", selectedPriceId);
    // Use the selectedPriceId value as needed
  } else {
    console.log("No plan selected yet.");
  }
  // Updated handleSubscription function
  const handleSubscription = async () => {
    setIsLoading(true);
    try {
      const subscriptionResponse = await axios.post(
        `/subscription_details/create-subscription-with-initial-charge`,
        {
          customer_Id: customerId,
          price_Id: priceId,
          promotionCode: sessionStorage.getItem("couponCode"),
          // promotionCode: "",
          NoOfProviders: sessionStorage.getItem("nofprovider"),
        }
      );

      if (subscriptionResponse.data.success) {
        // toast.success(subscriptionResponse.data.message);
        setSubscriptionMessage(subscriptionResponse.data.message);
        setPaymentStatus(true);
        setIsLoading(false);
        sessionStorage.removeItem("selectedPlanPriceId");
        await handleClientDetails();
      } else {
        setIsLoading(false);
        setSubscriptionFailMessage(
          subscriptionResponse.data.data?.message ||
            subscriptionResponse.data.message
        );
        const errorMsg =
          subscriptionResponse.data.data?.message ||
          subscriptionResponse.data.message ||
          "Subscription creation failed.";
        throw new Error(errorMsg); // Pass the detailed error to catch block
      }
    } catch (error) {
      // Check if error response contains specific message, otherwise fallback to generic message
      let errorMessage = "An unexpected error occurred.";
      if (error.response && error.response.data) {
        errorMessage =
          error.response.data.data?.message || // Nested message if available
          error.response.data.message || // General message if available
          error.message; // Default to caught error message
        setIsLoading(false);
      } else {
        errorMessage = error.message;
        setIsLoading(false);
      }
      setIsLoading(false);
      console.error("Error in subscription process:", errorMessage);
      // toast.error(errorMessage);
      setPaymentStatus(false);
      setSubscriptionFailMessage(errorMessage);
    }
  };

  // Handle client details verification and proceed to PDF agreement if successful
  const handleClientDetails = async () => {
    setIsLoading(true);

    try {
      // const { firstName, lastName, email } = formValues;
      const npiResponse = await axios.post(
        `/clientDetailsVerification`,
        {
          client_firstname: sessionStorage.getItem("firstname"),
          client_lastname: sessionStorage.getItem("lastname"),
          client_npinumber: sessionStorage.getItem("userValue"),
          client_email: sessionStorage.getItem("email"),
          client_phone: sessionStorage.getItem("userValue2"),
          client_emr: sessionStorage.getItem("emrU"),
          client_practicename: sessionStorage.getItem("practicenameU"),
          customer_Id: customerId,
          client_nofprovider: sessionStorage.getItem("nofprovider"),
        }
      );

      if (npiResponse.data.status === 201) {
        setIsLoading(false);
        // toast.success("Client details verified successfully");
        await handleAgreementPdf(); // Proceed to agreement if successful
      } else {
        setIsLoading(false);
        throw new Error("Client details send failed");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error verifying client details:", error);
      // toast.error(error.message);
      setSubscriptionMessage(""); // Reset message on error
    }
  };

  const handleAgreementPdf = async () => {
    setIsLoading(true);
    const setUpFee = 500; // Setup fee constant

    try {
      const response = await fetch(AgreePdf);

      // Fetch session storage values in the specified order
      const selectedPlanName = sessionStorage.getItem("selectedPlanName");
      const selectedPlanUnitAmount = sessionStorage.getItem(
        "clientSelectedPrice"
      );
      const nofprovider = sessionStorage.getItem("nofprovider");
      const CostPerMonth = sessionStorage.getItem("CostPerMonth");
      const PromotionalCostAmount = sessionStorage.getItem(
        "PromotionalCostAmount"
      );
      const TotalCostPerMonth = sessionStorage.getItem("TotalCostPerMonth");
      const RecuringTotalCostPerMonth = totalAmountCard;

      // Convert signed PDF to binary (Blob) format
      const signedPdf = await fetchAndSignPDF(
        response,
        sessionStorage.getItem("sign"),
        sessionStorage.getItem("agreeUserName"),
        sessionStorage.getItem("agreeTitle"),
        selectedPlanName,
        CostPerMonth,
        nofprovider,
        selectedPlanUnitAmount,
        PromotionalCostAmount,
        TotalCostPerMonth,
        setUpFee,
        RecuringTotalCostPerMonth
      );

      // Create Blob from signed PDF for binary format
      const pdfBlob = new Blob([signedPdf], { type: "application/pdf" });

      // Append pdfFile and client_email to FormData
      const formData = new FormData();
      formData.append("pdfFile", pdfBlob, "agreement.pdf"); // Specify the filename
      formData.append("client_email", sessionStorage.getItem("email"));
      formData.append(
        "client_practicename",
        sessionStorage.getItem("practicenameU")
      );

      const agreementResponse = await axios.post(
        `/clientAndCompanyAggrement`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("Sessiontoken")}`,
          },
        }
      );

      if (agreementResponse.status === 200) {
        setIsLoading(false);
        toast.success("Subscribed successfully");
        setSubscriptionMessage(
          "Your payment for the selected plan has been successfully processed. Please check your email for further details regarding your subscription."
        );
        // sessionStorage.clear();
        sessionStorage.removeItem("sign"); //sign
        sessionStorage.removeItem("agreeUserName"); //agreeUserName
        sessionStorage.removeItem("agreeTitle"); //agreeTitle
        sessionStorage.removeItem("firstname"); //firstname
        sessionStorage.removeItem("lastname"); //lastname
        sessionStorage.removeItem("email"); //email
        sessionStorage.removeItem("userValue"); //userValue
        sessionStorage.removeItem("userValue2"); //userValue2
        sessionStorage.removeItem("emrU"); //emrU
        sessionStorage.removeItem("practicenameU"); //practicenameU
        sessionStorage.removeItem("nofprovider"); //nofprovider
        sessionStorage.removeItem("selectedPlanName"); //selectedPlanName
        sessionStorage.removeItem("selectedPlanUnitAmount"); //selectedPlanUnitAmount
        sessionStorage.removeItem("CostPerMonth"); //CostPerMonth
        sessionStorage.removeItem("PromotionalCostAmount"); //PromotionalCostAmount
        sessionStorage.removeItem("TotalCostPerMonth"); //TotalCostPerMonth
        sessionStorage.removeItem("couponCode"); //couponCode
        sessionStorage.removeItem("clientSelectedPrice"); //clientSelectedPrice
        sessionStorage.removeItem("proratedAmount"); //proratedAmount
        localStorage.removeItem("Sessiontoken"); //session token
      } else {
        setIsLoading(false);
        throw new Error("Failed to submit agreement.");
      }
    } catch (error) {
      console.error("Error in agreement submission:", error);
      toast.error(error.message);
      setSubscriptionMessage("");
      setIsLoading(false);
    }
  };

  const fetchAndSignPDF = async (
    pdfResponse,
    signatureDataUrl,
    name,
    title,
    selectedPlanName,
    CostPerMonth,
    nofprovider,
    selectedPlanUnitAmount,
    PromotionalCostAmount,
    TotalCostPerMonth,
    setUpFee
  ) => {
    try {
      const pdfBytes = await pdfResponse.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Fetch and embed the signature image
      const signatureBytes = await fetch(signatureDataUrl).then((res) =>
        res.arrayBuffer()
      );
      const signatureImage = await pdfDoc.embedPng(signatureBytes);

      // Ensure the document has at least 9 pages
      if (pdfDoc.getPageCount() < 9) {
        throw new Error("PDF does not have 9 pages.");
      }

      // Access the 8th page (index 7) for signature and client info
      const page8 = pdfDoc.getPage(7);

      // Define maximum dimensions for the signature
      const maxSigWidth = 95;
      let sigWidth = maxSigWidth;
      let sigHeight = (signatureImage.height / signatureImage.width) * sigWidth;

      // Ensure the signature height doesn’t exceed a certain max value
      const maxSigHeight = 40;
      if (sigHeight > maxSigHeight) {
        sigHeight = maxSigHeight;
        sigWidth = (signatureImage.width / signatureImage.height) * sigHeight;
      }

      // Draw the signature at specified coordinates with adjusted dimensions on page 8
      page8.drawImage(signatureImage, {
        x: 100,
        y: 628,
        width: sigWidth,
        height: sigHeight,
      });

      // Draw name, title, and current date near the signature area with adjusted coordinates
      const currentDate = new Date().toLocaleDateString();

      // Draw client's name below the signature
      page8.drawText(` ${name}`, { x: 102, y: 603, size: 12 });

      // Draw client's title below the name
      page8.drawText(`${title}`, { x: 100, y: 575, size: 12 });

      // Draw date on the left side (client date)
      page8.drawText(`${currentDate}`, { x: 100, y: 550, size: 12 });

      // Draw date on the right side (company date) with adjusted `x` coordinate
      page8.drawText(`${currentDate}`, { x: 350, y: 550, size: 12 });

      // Access the 9th page (index 8) and draw additional values at the top
      const page9 = pdfDoc.getPage(8);

      // Draw text values at the top of the 9th page with adjusted coordinates
      page9.drawText(`${selectedPlanName}`, { x: 336, y: 618, size: 11 }); //planName
      page9.drawText(`${selectedPlanUnitAmount}`, { x: 490, y: 600, size: 12 }); //selectedPlancost
      page9.drawText(`${nofprovider}`, { x: 490, y: 580, size: 12 }); // noofprovider
      page9.drawText(` ${CostPerMonth}`, { x: 487, y: 560, size: 12 }); // Cost Per Month
      page9.drawText(`${PromotionalCostAmount}`, { x: 485, y: 540, size: 12 }); //Promotional Amount
      page9.drawText(`${TotalCostPerMonth}`, { x: 490, y: 520, size: 12 }); //Recurring Total Cost Per Month
      page9.drawText(`$${setUpFee}`, { x: 490, y: 500, size: 12 }); //One Time Set Up Fee

      // Save and return the signed PDF as a File object
      const signedPdfBytes = await pdfDoc.save();
      return new File([signedPdfBytes], "signed_agreement.pdf", {
        type: "application/pdf",
      });
    } catch (error) {
      console.error("Error signing PDF:", error);
      throw new Error("Failed to sign the PDF.");
    }
  };

  const handleSubmit = async (values) => {
    setIsNextLoading(true);
    const {
      firstName,
      lastName,
      email,
      npi,
      mobile,
      emr,
      practicename,
      nofprovider,
    } = values;
    const vl = npi;
    const vr = mobile;
    const emrU = emr;
    const practicenameU = practicename;
    sessionStorage.setItem("firstname", firstName);
    sessionStorage.setItem("lastname", lastName);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("userValue", vl);
    sessionStorage.setItem("userValue2", vr);
    sessionStorage.setItem("emrU", emrU);
    sessionStorage.setItem("practicenameU", practicenameU);
    sessionStorage.setItem("nofprovider", nofprovider);

    if (activeStep === 0) {
      try {
        const response = await axios.post(`/clientNpiVerification`, {
          client_firstname: firstName,
          client_lastname: lastName,
          client_npinumber: npi,
          client_email: email,
        });

        if (response.status === 201 || response.data?.data) {
          setIsNextLoading(false);
          updateFormValues({ firstName, lastName, email, npi }); // Update formValues with NPI
          handleNext(); // Move to the next step
        } else {
          setIsNextLoading(false);
          toast.error("NPI validation failed");
        }
      } catch (err) {
        setIsNextLoading(false);
        const errorMessage =
          err.response?.data?.data || "Registration failed. Please try again.";
        toast.error(errorMessage);
      }
    }
  };

  // Effect to handle redirection with URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    // Extract parameters from URL
    const paymentSuccessful = urlParams.get("success");
    const customerIdFromUrl = urlParams.get("customer_id");
    const priceUrl = urlParams.get("amount");
    const priceIdUrl = urlParams.get("selectedPriceId");
    const providerUrl = urlParams.get("providers");
    const shortToken = urlParams.get("short_token");

    console.log("shortTokenGet:", shortToken);

    // Handle `short_token` if it exists
    if (shortToken) {
      axios
        .get(`/token/access/Client-intake?short_token=${shortToken}`)
        .then((response) => {
          console.log("API Response:", response?.data);

          if (response?.data?.success) {
            // Token is valid
            setIsAuthorized(true);
            setApiResponse(response?.data);
            localStorage.setItem("Sessiontoken", response?.data?.session_token);
            console.log(
              "coupon_code_applicableeee",
              response?.data?.coupon_code_applicable
            );
            setShowCouponCodeField(response?.data?.coupon_code_applicable);
          } else {
            // Token is invalid
            setIsAuthorized(false);
            setErrorMessage(response?.data?.message || "Unauthorized access");
          }
        })
        .catch((error) => {
          // API error handling
          console.error("Error fetching token:", error);
          setIsAuthorized(false);
          // Check if the error has a response with a message
          const errorResponseMessage =
            error?.response?.data?.message ||
            "An error occurred while validating the token.";
          setErrorMessage(errorResponseMessage);
        });
    } else {
      // No token in URL, handle error
      setIsAuthorized(true);   //!currently static set  token validation 
      setErrorMessage("Token is missing from the URL.");
    }

    // Retrieve formValues from sessionStorage
    const storedFormValues = sessionStorage.getItem("formValues");
    if (storedFormValues) {
      setFormValues(JSON.parse(storedFormValues));
    }

    // Retrieve customerId from sessionStorage (if available)
    const storedCustomerId = sessionStorage.getItem("customerId");
    if (storedCustomerId) {
      setCustomerId(storedCustomerId);
    }

    // Handle payment success and update relevant states
    if (paymentSuccessful && customerIdFromUrl) {
      setCustomerId(customerIdFromUrl);
      setPaymentStatus(paymentSuccessful === "true");
      setPrice(priceUrl);
      setPriceId(priceIdUrl);
      setTotalProviders(providerUrl);
    }
  }, []); // Dependency array ensures this effect runs only once

  // Show subscription result based on redirect response
  if (customerId && paymentStatus !== null) {
    return (
      <Box>
        <SubscriptionResult
          customerId={customerId}
          paymentStatus={paymentStatus}
          subscriptionMessage={subscriptionMessage}
          handleSubscription={handleSubscription}
          handlePayment={handlePayment}
          subscriptionFailMessage={subscriptionFailMessage}
          isLoading={isLoading}
          totalProviders={totalProviders}
          price={price}
          totalAmountCard={totalAmountCard}
        />
        <Toaster position="top-center" />
      </Box>
    );
  }

  if (isAuthorized === null) {
    return (
      <div class="loader-container">
        <div class="loader"></div>
      </div>
    ); // Show loading state
  }

  return (
    <Box>
      <Box
        component="img"
        src={SiddhaAiLogo}
        alt="Logo"
        sx={{
          display: { xs: "none", sm: "none", md: "block" },
          width: 400,
          position: "absolute",
          top: -100,
          left: -90,
        }}
      />

      <Container maxWidth="md">
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: 5,
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          {/* If short token valid  */}
          {isAuthorized ? (
            <Box>
              {/* <Stepper activeStep={activeStep} sx={{ mb: 4, width: "100%" }}>
           {steps.map((label) => (
             <Step key={label}>
               <StepLabel>{label}</StepLabel>
             </Step>
           ))}
         </Stepper> */}
              <Formik
                
              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  touched,
                  errors,
                  isValid,
                  dirty,
                }) => (
                  <form  style={{ width: "100%" }}>
                    {/* Step 0: Registration */}

                   
                    {/* Step 1: Subscription Plan */}
                    {activeStep === 0 && (
                      <Box sx={{ textAlign: "center", px: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 2,
                            fontWeight: 600,
                            // background:
                            //   "linear-gradient(to right, #2ca6af, #109fb3, #0098b6, #0090b8, #0488b9)",
                            padding: "10px",
                            borderRadius: "5px",
                            // color: "#fff",
                          }}
                        >
                          Select Subscription Plan (Prices in USD)
                        </Typography>

                        {/* Loading spinner */}
                        {priceLoading ? (
                          <CircularProgress />
                        ) : plans.length === 0 ? (
                          // Empty state message
                          <Typography variant="body1" sx={{ mt: 3 }}>
                            No price details available
                          </Typography>
                        ) : (
                          // Price cards display
                          <Grid
                            container
                            spacing={4}
                            justifyContent="center"
                            sx={{ mt: 4 }}
                          >
                            {plans.map((tier) => (
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                key={tier.default_price}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <Card
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    textAlign: "center",
                                    borderRadius: "12px",
                                    boxShadow:
                                      "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: "#fff",
                                    p: 3,
                                    width: "100%",
                                    maxWidth: "350px",
                                    minHeight: "400px", // Ensures consistent height for all cards
                                    border:
                                      selectedPlan === tier.default_price
                                        ? "2px solid #2ca6af" // Highlight border color for selected plan
                                        : "2px solid transparent", // Default border
                                    transition: "border-color 0.3s ease-in-out", // Smooth transition effect
                                  }}
                                >
                                  {/* Card Content */}
                                  <CardContent
                                    sx={{
                                      flexGrow: 1, // Ensures content area expands
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                    }}
                                  >
                                    {/* Plan Name */}
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        color: "#000",
                                        mb: 1,
                                      }}
                                    >
                                      {tier.products_name}
                                    </Typography>
                                    {/* Underline */}
                                    <Box
                                      sx={{
                                        height: "4px",
                                        width: "40px",
                                        background:
                                          "linear-gradient(to right, #2ca6af, #109fb3, #0090b8, #0090b8, #0488b9)",
                                        mb: 2,
                                        borderRadius: "4px",
                                      }}
                                    />
                                    {/* Price */}
                                    <Typography
                                      variant="h3"
                                      sx={{
                                        fontWeight: "bold",
                                        color: "#000",
                                        mb: 1,
                                      }}
                                    >
                                      ${tier.unit_amount}
                                    </Typography>
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        color: "text.secondary",
                                        mb: 2,
                                      }}
                                    >
                                      Per {tier.recurring}
                                    </Typography>
                                    {/* Features List */}
                                    {tier.marketing_features && (
                                      <List
                                        dense
                                        sx={{
                                          width: "100%",
                                          px: 2, // Add padding to the left and right of the list
                                        }}
                                      >
                                        {tier.marketing_features.map(
                                          (feature, index) => (
                                            <ListItem
                                              key={index}
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                py: 0.5, // Vertical spacing between items
                                                px: 1, // Add horizontal padding to each item for additional spacing
                                              }}
                                            >
                                              <ListItemIcon
                                                sx={{
                                                  minWidth: "40px", // Space between the icon and text
                                                }}
                                              >
                                                <CheckIcon
                                                  sx={{
                                                    color: "rgba(47,169,174,1)",
                                                    backgroundColor: "#E6F5EC",
                                                    borderRadius: "50%",
                                                    width: "20px",
                                                    height: "20px",
                                                    padding: "4px",
                                                  }}
                                                />
                                              </ListItemIcon>
                                              <ListItemText
                                                primary={feature.name}
                                                primaryTypographyProps={{
                                                  variant: "body2",
                                                  color: "text.secondary",
                                                }}
                                              />
                                            </ListItem>
                                          )
                                        )}
                                      </List>
                                    )}
                                  </CardContent>
                                  {/* Select Plan Button */}
                                  <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                      mt: 3,
                                      background:
                                        "linear-gradient(to right, #2ca6af, #109fb3, #0090b8, #0090b8, #0488b9)",
                                      color: "#fff",
                                      fontWeight: "600",
                                      borderRadius: "8px",
                                      padding: "10px 0",
                                      "&:hover": {
                                        background:
                                          "linear-gradient(to right, #2ca6af, #109fb3, #0098b6, #0090b8, #0488b9)",
                                        opacity: 0.8,
                                      },
                                    }}
                                    onClick={() => {
                                      // if showCoupon code false run handleCouponCode function
                                      setSelectedPlan(tier.default_price);
                                      sessionStorage.setItem(
                                        "selectedPlanPriceId",
                                        tier.default_price
                                      );
                                      sessionStorage.setItem(
                                        "selectedPlanUnitAmount",
                                        tier.unit_amount
                                      );
                                      sessionStorage.setItem(
                                        "selectedPlanName",
                                        tier.products_name
                                      );
                                    }}
                                  >
                                    Select Plan
                                  </Button>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        )}

                        {/* Next and Back buttons */}
                        <Box
                          sx={{
                            mt: 4,
                            display: "flex",
                            justifyContent: "center",
                            gap: 2,
                          }}
                        >
                          {selectedPlan && showCouponCodeField && (
                            <>
                              <Grid container spacing={3} alignItems="center">
                                {/* Coupon Code Input */}
                                <Grid item xs={12}>
                                  <TextField
                                    id="couponcode"
                                    name="couponcode"
                                    label="Your Coupon Code"
                                    value={couponCode}
                                    onChange={(e) => {
                                      setCouponCode(e.target.value);
                                      setIsCouponApplied(false); // Reset the tick icon if user changes input
                                      setProceedWithoutCoupon(false); // Reset proceed state
                                    }}
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          {/* Show Check Icon when coupon is verified */}
                                          {isCouponApplied && (
                                            <CheckIcon
                                              sx={{
                                                color: "green",
                                                fontSize: "1.5rem", // Small size
                                              }}
                                            />
                                          )}
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                </Grid>

                                {/* Apply and Clear Buttons */}
                                <Grid item  xs={12}>
                                  <Box
                                    display="flex"
                                    flexDirection={{ xs: "column", sm: "row" }} // Column for small screens, row for larger
                                    justifyContent={{
                                      sm: "flex-start",
                                      xs: "center",
                                    }} // Align center for smaller screens
                                    alignItems="center"
                                    gap={2} // Spacing between buttons
                                  >
                                    {/* Apply Button */}
                                    <Button
                                      variant="contained"
                                      onClick={()=>handleCouponCode(false)}
                                      sx={{
                                        fontSize: { xs: "0.9rem", sm: "1rem" },
                                        mt: { xs: 2, sm: 0 }, // Add margin on smaller screens for better spacing
                                        background:
                                          "linear-gradient(to right, #2ca6af, #109fb3, #0090b8, #0090b8, #0488b9)",
                                        color: "#fff",
                                        borderRadius: "8px",
                                        padding: "10px 20px",
                                        textTransform: "none",
                                        "&:hover": {
                                          background:
                                            "linear-gradient(to right, #2ca6af, #109fb3, #0098b6, #0090b8, #0488b9)",
                                          opacity: 0.8,
                                        },
                                      }}
                                      disabled={
                                        couponLoading || isCouponApplied
                                      } // Disable when applied
                                    >
                                      {couponLoading ? (
                                        <CircularProgress
                                          sx={{ color: "#fff" }}
                                          size={25}
                                        />
                                      ) : isCouponApplied ? (
                                        <Typography sx={{ color: "#fff" }}>
                                          Applied
                                        </Typography>
                                      ) : (
                                        <Typography sx={{ color: "#fff" }}>
                                          Apply
                                        </Typography>
                                      )}
                                    </Button>

                                    {/* Clear Button */}
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      onClick={() => {
                                        setCouponCode(""); // Clear the coupon code
                                        setIsCouponApplied(false); // Reset tick icon
                                        setProceedWithoutCoupon(false);
                                      }}
                                      sx={{
                                        fontSize: { xs: "0.9rem", sm: "1rem" },
                                        mt: { xs: 2, sm: 0 }, // Add margin on smaller screens for better spacing
                                        borderRadius: "8px",
                                        padding: "10px 20px",
                                        textTransform: "none",
                                      }}
                                    >
                                      Clear
                                    </Button>
                                  </Box>
                                </Grid>
                              </Grid>
                            </>
                          )}
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={isNextButtonDisabled}
                            sx={{
                              background: isNextButtonDisabled
                                ? "linear-gradient(to right, #d3d3d3, #e0e0e0)"
                                : "linear-gradient(to right, #2ca6af, #109fb3, #0090b8)",
                              color: isNextButtonDisabled ? "#aaa" : "#fff",
                              borderRadius: "8px",
                              "&:hover": {
                                background: isNextButtonDisabled
                                  ? "linear-gradient(to right, #d3d3d3, #e0e0e0)"
                                  : "linear-gradient(to right, #2ca6af, #109fb3, #0098b6)",
                                opacity: isNextButtonDisabled ? 1 : 0.8,
                              },
                            }}
                          >
                            Next
                          </Button>
                        </Box>
                        {/* Dialog Box */}
                        <Dialog
                          open={dialogOpen}
                          onClose={() => handleDialogClose(false)}
                        >
                          <DialogTitle>Proceed Without Coupon?</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              Are you sure you want to proceed without entering
                              a coupon code?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={() => handleDialogClose(false)}
                              color="error"
                              variant="outlined"
                            >
                              No
                            </Button>
                            <Button
                              onClick={() => handleDialogClose(true)}
                             sx={{
                              background: "linear-gradient(to right, #2ca6af, #109fb3, #0098b6)",}}
                              variant="contained"
                            >
                              Yes
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </Box>
                    )}
                    {/* Step 2: Payment */}
                    {activeStep === 2 && (
                      <Box>
                        <Accordion
                          expanded={expandedOne}
                          onChange={handleAccordionChangeOne}
                        >
                          <AccordionSummary
                            sx={{
                              "& .MuiAccordionSummary-expandIconWrapper": {
                                transform: "none !important", // Prevent rotation for check icon
                              },
                            }}
                            // Toggle between the down/up arrow based on the expanded state
                            expandIcon={
                              isPayAgreed ? (
                                <CheckIcon color="success" /> // Check icon when isAgreed is true
                              ) : expanded ? (
                                <ArrowUpwardIcon /> // Up arrow when expanded
                              ) : (
                                <ArrowDownwardIcon /> // Down arrow when collapsed
                              )
                            }
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
                            <Box sx={{ textAlign: "center" }}>
                              {/* <Box sx={{ textAlign: "center",width: "100%", }}> */}

                              <Typography
                                variant="h6"
                                sx={{
                                  mb: 2,
                                  fontWeight: 600,
                                  // background:
                                  //   "linear-gradient(to right, #2ca6af, #109fb3, #0098b6, #0090b8, #0488b9)",
                                  padding: "10px",
                                  borderRadius: "5px",
                                  textAlign: "center",
                                  // color: "#fff",
                                }}
                              >
                                SUBSCRIPTION AGREEMENT
                              </Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box
                              sx={{
                                mt: 2,
                                maxHeight: 300,
                                overflowY: "auto",
                                padding: "0 20px",
                                backgroundColor: "#f4f4f4",
                                borderRadius: 2,
                                boxShadow: 1,
                              }}
                            >
                              <p>
                                This Subscription Agreement (the “Subscription
                                Agreement”), is effective as of the date set
                                forth in the Order Form (the “Effective Date”)
                                is by and between Siddha AI, Inc. (“SAI”) and
                                the client who executes the Order (the
                                “Client”). The “Agreement” consist of (i) this
                                Subscription Agreement, (ii) any schedules
                                hereto, and (iii) any Order Form entered into
                                under this Subscription Agreement. By entering
                                into this Subscription Agreement.
                              </p>
                              <ol type="1">
                                <li>
                                  <strong>Definitions.</strong>
                                  <ol type="a">
                                    <br />
                                    <li>
                                      &quot;Client Data&quot; means any of
                                      Client’s information, documents, or
                                      electronic files that are uploaded to the
                                      Subscription Services.
                                    </li>
                                    <li>
                                      &quot;Documentation&quot; means the online
                                      documentation for the Subscription
                                      Services provided by SAI, as the same may
                                      be revised and updated by SAI from time to
                                      time.
                                    </li>
                                    <li>
                                      “Patient” means an individual whom Client
                                      has provided access to the Subscription
                                      Service.
                                    </li>
                                    <li>
                                      “Patient Data” means any information or
                                      data entered into the Subscription
                                      Services by a Patient.
                                    </li>
                                    <li>
                                      &quot;Provider&quot; means a named medical
                                      provider for whom the Client desires to
                                      use the Subscription Services.
                                    </li>
                                    <li>
                                      &quot;Subscription Services&quot; means
                                      SAI’s proprietary hosted software patient
                                      registration system (including any
                                      updates, revisions, enhancements,
                                      modifications, and derivative works
                                      thereof that may be provided hereunder),
                                      including the related services specified
                                      in the Order Form (if any).
                                    </li>
                                  </ol>
                                </li>
                                <br />
                                <li>
                                  <strong>Trial.</strong>
                                  <br />
                                  <p>
                                    SAI provides a free trial license to the
                                    Subscription Services for a period of three
                                    (3) months from the Effective Date (“Trial
                                    Term”). In order to use the Subscription
                                    Services, Client must pay the one-time
                                    Set-Up Fee and engage in the set-up process.
                                    At the expiration of the Trial Term, the
                                    Agreement will continue as set forth in the
                                    applicable Order Form. THE TRIAL IS PROVIDED
                                    ONCE AND ONLY UPON EXECUTION OF THE FIRST
                                    ORDER FORM FOR A SINGLE THREE MONTH PERIOD.
                                    THE TRIAL IS NOT PROVIDED UPON SUBSEQUENT
                                    ORDER FORMS BY CLIENT OR CLIENT’S AGENTS OR
                                    AFFILIATES. THE TRIAL IS PROVIDED “AS-IS”
                                    WITHOUT WARRANTY OF ANY KIND AND SUBJECT TO
                                    THE FURTHER DISCLAIMERS AND LIMITATIONS
                                    CONTAINED HEREIN.
                                  </p>
                                </li>
                                <br />
                                <li>
                                  <strong>License and Services.</strong>
                                  <ol type="a">
                                    <br />
                                    <li>
                                      Grant. Subject to the terms and conditions
                                      of this Agreement, and payment in full of
                                      all applicable Subscription Fees, SAI
                                      hereby grants to Client a non­exclusive,
                                      non­transferable, non­sublicensable,
                                      limited right to permit Client&#39;s users
                                      to use the Subscription Services for
                                      Client&#39;s internal purposes only in
                                      accordance with the Documentation.
                                    </li>
                                    <li>
                                      Enrollment. Order Forms, which include a
                                      written description of the
                                      Programs/Service, term, and number of
                                      licenses to access the Subscription
                                      Services under this Subscription
                                      Agreement, a form of which is attached as
                                      Exhibit A (“Order Form”), may be agreed to
                                      and executed from time to time by SAI and
                                      Client.
                                    </li>
                                    <li>
                                      Set up. SAI will provide to Client set-up
                                      services relating to the Subscription
                                      Services as described in the applicable
                                      Order Form.
                                    </li>
                                    <li>
                                      SLA. The Subscription Services shall be
                                      available to Client and its users at least
                                      98% percent of the time during each
                                      calendar month except for unavailability
                                      outside of SAI’s control, scheduled system
                                      backups, updates, or other on- going
                                      maintenance as required and scheduled in
                                      advance by SAI, the Subscriber, or
                                      third-party hosts or app stores. In the
                                      event that the Subscription Services fails
                                      to meet this uptime guarantee, Client may
                                      terminate this Agreement as set forth
                                      herein. Subject to the terms hereof, SAI
                                      will provide Client with reasonable
                                      technical support services in accordance
                                      SAI’s standard practice.
                                    </li>
                                  </ol>
                                </li>
                                <br />
                                <li>
                                  <strong> Ownership.</strong>
                                  <ol type="a">
                                    <br />
                                    <li>
                                      SAI is and shall remain the owner of the
                                      Subscription Services and Client
                                      acknowledges and agrees that SAI shall own
                                      all right, title and interest in and to
                                      all intellectual property rights
                                      (including all derivatives or improvements
                                      thereof) in the Subscription Services,
                                      including without limitation any invention
                                      or discovery related to the Subscription
                                      Services that may be made as a consequence
                                      of Client’s using the Subscription
                                      Services. If Client or any of Client’s
                                      users provide to SAI any suggestions,
                                      enhancement requests, feedback,
                                      recommendations or other information
                                      relating to the Subscription Services
                                      (“Feedback”), SAI may freely use and
                                      exploit such Feedback in any manner and
                                      for any purpose without any consideration
                                      to Client or its users or any other
                                      obligations or restrictions. All rights in
                                      and to the Subscription Services not
                                      expressly granted herein are reserved to
                                      SAI.
                                    </li>
                                    <li>
                                      Except as expressly permitted hereunder,
                                      Client shall not, directly, indirectly,
                                      alone, or with another party do or attempt
                                      to do any of the following: (i) copy,
                                      disassemble, reverse engineer, decompile,
                                      or attempt to derive the source code of
                                      the underlying software or technology
                                      providing the Subscription Services; (ii)
                                      modify, create derivative works based
                                      upon, or translate the Subscription
                                      Services; (iii) license, sell, rent,
                                      lease, transfer, grant any rights in or
                                      otherwise commercially exploit the
                                      Subscription Services in any form with any
                                      other party; (iv) upload Client Data or
                                      other content which misappropriates or
                                      violates any third party proprietary
                                      rights or privacy rights; (v) remove,
                                      modify or otherwise tamper with notices or
                                      legends on the Subscription Services or
                                      Documentation; (vi) interfere with the
                                      operation or functionality of the
                                      Subscription Services; (vii) attempt to
                                      probe, scan, penetrate, breach or test the
                                      vulnerability of the Subscription Services
                                      or disable or circumvent the Subscription
                                      Services’ security or authentication
                                      measures; or (viii) use or access the
                                      Subscription Services for the purpose of
                                      building a competitive product or service.
                                    </li>
                                    <li>
                                      Client shall retain and own all right,
                                      title and interest in the Client Data. A
                                      Patient shall retain ownership of their
                                      Patient Data. Client acknowledges that
                                      Patients will be required to accept an End
                                      User License Agreement (“EULA”) upon
                                      accessing the Subscription Services. The
                                      Subscription Services do not host any
                                      Patient Data. Patient Data is transmitted
                                      through the Subscription Services directly
                                      to Subscriber.
                                    </li>
                                    <li>
                                      Client is responsible for ensuring that
                                      Client and using best efforts to ensure
                                      Client&#39;s users use of the Subscription
                                      Services is in compliance with all
                                      applicable laws and governmental
                                      regulations and Client acknowledges that
                                      Client assumes all risk arising from any
                                      such use that is not compliant with
                                      applicable laws and regulations.
                                    </li>
                                    <li>
                                      Client is solely responsible for
                                      maintaining the security of all user names
                                      and passwords granted to it, for the
                                      security of its information systems used
                                      to access the Subscription Services, and
                                      for its users’ compliance with the terms
                                      of this Agreement. SAI will act as though
                                      any electronic communications it receives
                                      under Client&#39;s user names have been
                                      sent by Client. Client will immediately
                                      notify SAI if it becomes aware of any loss
                                      or theft or unauthorized use of any of
                                      Client&#39;s passwords or user names. SAI
                                      has the right at any time to terminate or
                                      suspend access to any user or to Client if
                                      SAI believes in good faith that such
                                      termination or suspension is necessary to
                                      preserve the security, integrity, or
                                      accessibility of the Subscription
                                      Services. SAI will provide notice to
                                      Client of any such action as promptly as
                                      possible.
                                    </li>
                                  </ol>
                                </li>
                                <br />
                                <li>
                                  <strong>
                                    Client Obligations and Representations.
                                  </strong>
                                  <ol type="a">
                                    <br />
                                    <li>
                                      Client shall be responsible for obtaining
                                      and installing any required hardware
                                      upgrades to Client’s existing hardware
                                      configuration. SAI does not sell, install
                                      or service hardware components. The fees
                                      specified in the Agreement do not include
                                      any hardware components or the
                                      installation, maintenance or
                                      troubleshooting of hardware components.
                                    </li>
                                    <li>
                                      Client is responsible for and assumes all
                                      liability for:
                                      <ol type="i">
                                        <br />
                                        <li>
                                          ensuring that the Subscription
                                          Services meets Client’s specific needs
                                          prior to using the Subscription
                                          Services;
                                        </li>
                                        <li>
                                          all content and data provided to SAI
                                          by or through Client for use with the
                                          Subscription Services, including
                                          ensuring that the data that is loaded
                                          into the Subscription Services is
                                          accurate;
                                        </li>
                                        <li>
                                          using reasonable security methods to
                                          transfer Patient Data and Client Data;
                                        </li>
                                        <li>
                                          the use of the Subscription Services
                                          by its employees and any other party
                                          that accesses the Subscription
                                          Services using Client’s account
                                          details.
                                        </li>
                                        <li>
                                          decisions about, implementing and
                                          maintaining Client’s computer,
                                          communications systems, and security
                                          procedures and devices needed to use
                                          the Subscription Services;
                                        </li>
                                        <li>
                                          all software that is not hosted by
                                          SAI.
                                        </li>
                                      </ol>
                                    </li>
                                  </ol>
                                </li>
                                <br />
                                <li>
                                  <strong>Payment Terms.</strong>
                                  <ol type="a">
                                    <br />
                                    <li>
                                      The Client shall pay to SAI the monthly
                                      recurring fees (“Subscription Fees”) and
                                      the one time set- up fee as described in
                                      the Order Form. Monthly Subscription Fees
                                      will commence billing at the end of the
                                      Trial term. Thereafter, the Subscription
                                      Fee will be due on the 1 st day of each
                                      month. All fees paid hereunder are
                                      non-refundable. Amounts remaining
                                      outstanding for more than five (5) days
                                      (past due), will be subject to an interest
                                      charge of 1.5% per month from the date of
                                      the invoice. Additionally, Client shall
                                      reimburse SAI for all out-of-pocket costs
                                      of collection for overdue invoices. SAI
                                      reserves the right to suspend Subscription
                                      Services if not timely paid, in which
                                      event SAI will not be liable for any
                                      resulting loss, damage or expense in
                                      connection with such suspension.
                                    </li>
                                    <li>
                                      Client is responsible for not exceeding
                                      the number of Providers on an Order Form.
                                      In the event that the number of Providers
                                      exceeds the number listed for any of the
                                      SAI Programs listed on an Order Form
                                      (“Additional Users”), Client will be
                                      invoiced for Additional Users, and shall
                                      pay to SAI an additional charge per
                                      Additional User, per the Order Form, per
                                      month.
                                      <li>
                                        All Subscription Fees are
                                        non-cancelable, non-refundable and
                                        non-transferable. In no event, under any
                                        circumstance will SAI provide a refund
                                        of any Subscription Fees paid.
                                      </li>
                                    </li>
                                  </ol>
                                </li>
                                <br />
                                <li>
                                  <strong>Term and Termination.</strong>
                                  <br />
                                  <p>
                                    This Subscription Agreement is effective as
                                    of the Effective Date and will continue
                                    unless otherwise terminated as provided
                                    herein. Each Order Form will have the term
                                    provided in that Order Form. The termination
                                    of this Subscription Agreement shall
                                    terminate each Order Form governed by this
                                    Subscription Agreement.
                                  </p>
                                  <ol type="a">
                                    <br />
                                    <li>
                                      Client may terminate an Order Form and
                                      this Subscription Agreement upon thirty
                                      (30) days advance notice to SAI. The
                                      termination shall be effective at the end
                                      of the monthly term during which the last
                                      day of the thirty (30) day notice period
                                      falls.
                                    </li>
                                    <li>
                                      SAI shall have the right to terminate this
                                      Subscription Agreement effective upon
                                      written notice to Client if Client fails
                                      to comply with any material obligation
                                      under the Agreement and such noncompliance
                                      continues for more than 30 days after
                                      notice from SAI.
                                      <li>
                                        SAI reserves the right, effective
                                        immediately upon notice to Client, to
                                        limit, modify or terminate, as
                                        necessary, any or all Subscription
                                        Services in whole or in part if, in
                                        SAI’s sole reasonable judgment, use of
                                        the Subscription Services by Client or
                                        its authorized users (i) presents a
                                        material security risk or will interfere
                                        materially with the proper continued
                                        operation of the Subscription Services;
                                        (ii) violates applicable laws or
                                        governmental regulations; (iii) violates
                                        or infringes any intellectual property
                                        right of SAI or a third party; (iv)
                                        violates export control regulations of
                                        the United States or other applicable
                                        countries; or (v) is subject to an order
                                        from a court or governmental entity
                                        stating that such use generally or for
                                        certain activities must stop. Notice is
                                        achieved by email transmission for
                                        purposes of this Section. In the event
                                        that SAI in its sole judgment determines
                                        that it will or must stop offering the
                                        Subscription Services, it shall notify
                                        the Client and all licenses with respect
                                        to such Subscription Services shall
                                        terminate on the date set forth in the
                                        notice provided by SAI to the Client.
                                      </li>
                                      <li>
                                        The expiration or termination of this
                                        Subscription Agreement or any Order Form
                                        hereunder, for any reason (including
                                        non-renewal), shall automatically and
                                        without further action by SAI, terminate
                                        and extinguish Client’s right to use the
                                        Subscription Services identified in the
                                        applicable Order Form.
                                      </li>
                                    </li>
                                  </ol>
                                </li>
                                <br />
                                <li>
                                  <strong> Warranties and Disclaimers.</strong>

                                  <ol type="a">
                                    <br />
                                    <li style={{ listStyleType: "none" }}>
                                      SAI does not warrant that: (i) the
                                      Subscription Services will achieve any
                                      specific result or meet Client&#39;s
                                      requirements; (ii) the Subscription
                                      Services will be uninterrupted or
                                      error-free; or (iii) the Subscription
                                      Services will work in conjunction with the
                                      computer systems or devices selected by
                                      Client or Client’s users.
                                    </li>
                                    <br />
                                    <li style={{ listStyleType: "none" }}>
                                      GENERAL DISCLAIMER. THE SUBSCRIPTION
                                      SERVICES ARE PROVIDED “AS IS” AND SAI
                                      MAKES NO WARRANTIES OR REPRESENTATIONS
                                      CONCERNING THE SAME OR ANY RESULTS TO BE
                                      ACHIEVED THROUGH USE OF THE SUBSCRIPTION
                                      SERVICES. SAI DISCLAIMS ANY AND ALL
                                      REPRESENTATIONS AND WARRANTIES, EXPRESS OR
                                      IMPLIED, INCLUDING BUT NOT LIMITED TO
                                      WARRANTIES OF MERCHANTABILITY, FITNESS FOR
                                      A PARTICULAR PURPOSE, NONINFRINGEMENT,
                                      DATA ACCURACY, SYSTEM INTEGRATION OR ANY
                                      WARRANTIES ARISING FROM COURSE OF DEALING,
                                      USAGE, OR COURSE OF PERFORMANCE.
                                    </li>
                                    <br />
                                    <li style={{ listStyleType: "none" }}>
                                      NO SECURITY WARRANTY. CLIENT ACKNOWLEDGES
                                      THAT SECURITY SAFEGUARDS, BY THEIR NATURE,
                                      ARE CAPABLE OF CIRCUMVENTION AND THAT SAI
                                      DOES NOT AND CANNOT GUARANTEE THAT THE
                                      SUBSCRIPTION SERVICES, SAI’S SYSTEMS, AND
                                      THE INFORMATION CONTAINED THEREIN
                                      (INCLUDING CONFIDENTIAL INFORMATION)
                                      CANNOT BE ACCESSED BY UNAUTHORIZED PERSONS
                                      CAPABLE OF OVERCOMING SUCH SAFEGUARDS. SAI
                                      SHALL NOT BE RESPONSIBLE OR LIABLE FOR ANY
                                      SUCH UNAUTHORIZED ACCESS NOR SHALL ANY
                                      SUCH UNAUTHORIZED ACCESS CONSTITUTE A
                                      BREACH BY SAI OF ITS CONFIDENTIALITY
                                      OBLIGATIONS HEREUNDER.
                                    </li>
                                    <br />
                                    <li style={{ listStyleType: "none" }}>
                                      DISCLAIMER OF ACTIONS CAUSED BY OR UNDER
                                      THE CONTROL OF THIRD PARTIES. SAI DOES NOT
                                      AND CANNOT CONTROL THE PERFORMANCE OF ANY
                                      CONTENT, DATA, PRODUCTS, SOFTWARE OR
                                      SERVICES PROVIDED OR CONTROLLED BY CLIENT
                                      OR ANY THIRD PARTY. AT TIMES, ACTION OR
                                      INACTION BY CLIENT OR THIRD PARTIES CAN
                                      IMPAIR OR DISRUPT SUBSCRIPTION SERVICES.
                                      SAI MAKES NO REPRESENTATIONS AND EXPRESSLY
                                      DISCLAIMS ALL WARRANTIES REGARDING THE
                                      CONTENT, DATA, PRODUCTS, SOFTWARE OR
                                      SERVICES OF CLIENT OR ANY THIRD PARTY,
                                      INCLUDING, BUT NOT LIMITED TO, THE
                                      PROVIDERS OF ELECTRICAL OR
                                      TELECOMMUNICATIONS PRODUCTS, SOFTWARE OR
                                      SERVICES. SUCH CONTENT, DATA, PRODUCTS,
                                      SOFTWARE AND SERVICES ARE NOT PROMISED TO
                                      BE FREE OF ERROR OR INTERRUPTION, AND SAI
                                      EXPRESSLY DISCLAIMS ALL LIABILITIES
                                      ARISING FROM ANY SUCH ERROR, INTERRUPTION,
                                      OR OTHER FAILURE.
                                    </li>
                                    <br />
                                    <li style={{ listStyleType: "none" }}>
                                      LIMITATION OF LIABILITY. IN NO EVENT SHALL
                                      SAI BE LIABLE, WHETHER BASED UPON
                                      CONTRACT, INDEMNITY, WARRANTY, TORT
                                      (INCLUDING NEGLIGENCE), STRICT LIABILITY
                                      OR OTHERWISE, FOR ANY INDIRECT,
                                      INCIDENTAL, CONSEQUENTIAL, SPECIAL,
                                      PUNITIVE OR EXEMPLARY DAMAGES (EVEN IF SAI
                                      HAS BEEN ADVISED OF OR COULD HAVE
                                      REASONABLY FORESEEN THE POSSIBILITY OF
                                      SUCH DAMAGES), INCLUDING, BUT NOT LIMITED
                                      TO, INTERRUPTION OF BUSINESS OR LOSS OF
                                      REVENUE, PROFITS, DATA OR USE. SAI’S
                                      AGGREGATE LIABILITY FOR ANY OTHER DAMAGES
                                      SHALL NOT EXCEED THE AMOUNT PAID FOR THE
                                      SUBSCRIPTION SERVICES DURING THE SIX MONTH
                                      PERIOD IMMEDIATELY PRECEDING THE DATE A
                                      CLAIM AROSE.
                                    </li>
                                  </ol>
                                </li>
                                <br />
                                <li>
                                  <strong>Confidential Information.</strong>
                                  <ol type="a">
                                    <br />
                                    <li>
                                      Obligations as to Confidential
                                      Information. Either Party may, in
                                      connection with this Agreement, disclose
                                      (the “Disclosing Party”) to the other
                                      Party (the “Receiving Party”) information
                                      considered confidential or proprietary
                                      information (“Confidential Information”).
                                      Information shall be considered
                                      Confidential Information if marked
                                      confidential or proprietary, identified as
                                      confidential in nature by the Disclosing
                                      Party at the time of disclosure, or which
                                      by its nature is normally considered
                                      confidential or provides the Disclosing
                                      Party with a competitive advantage.
                                      Confidential Information of SAI includes,
                                      and is not limited to, the terms and
                                      conditions and fees under this Agreement,
                                      any service provided pursuant to this
                                      Agreement, any proposal to provide
                                      services, and any specifications,
                                      benchmark or testing results in connection
                                      with the Subscription Services. A
                                      Receiving Party shall (i) limit access to
                                      and use of a Disclosing Party’s
                                      Confidential Information to those of the
                                      Receiving Party’s employees and third
                                      party agents that require such access and
                                      use in connection with its performance of
                                      an obligation under this Agreement and who
                                      are bound by confidentiality provisions no
                                      less restrictive than those in this
                                      Section; (ii) not disclose Disclosing
                                      Party’s Confidential Information to third
                                      parties, unless authorized under this
                                      Section; (iii) protect the Disclosing
                                      Party’s Confidential Information as it
                                      protects its own Confidential Information,
                                      but in any event with not less than a
                                      reasonable degree of care; and (iv) not
                                      use the Disclosing Party’s Confidential
                                      Information for any purpose except as
                                      permitted hereunder. Each Receiving Party
                                      shall take appropriate action with its
                                      employees, or third party agents to
                                      satisfy its obligations hereunder.
                                    </li>
                                    <li>
                                      Exceptions. Nothing in this Section shall
                                      prevent a Receiving Party from disclosing
                                      Confidential Information to the extent
                                      that such Confidential Information is: (i)
                                      previously known to the Receiving Party
                                      prior to disclosure by the Disclosing
                                      Party, without any obligation of
                                      confidentiality; (ii) publicly known or
                                      becomes publicly known through no breach
                                      of this Agreement by the Receiving Party;
                                      (iii) rightfully received from a third
                                      party under no confidentiality obligation
                                      with respect to the Confidential
                                      Information; (iv) independently developed
                                      by the Receiving Party without use of the
                                      Disclosing Party’s Confidential
                                      Information; (v) disclosed without similar
                                      restrictions to a third party by the
                                      Disclosing Party; or (vi) disclosed to
                                      taxing authorities or to representative
                                      and advisors in connection with tax
                                      filings, reports, claims, audits and
                                      litigation.
                                      <li>
                                        Mandatory Disclosure. If any judicial,
                                        legislative or administrative body
                                        requests or threatens to compel
                                        disclosure of Confidential Information,
                                        the Receiving Party shall promptly
                                        notify the Disclosing Party to the
                                        extent not legally prohibited. The
                                        Receiving Party will comply with
                                        reasonable requests of the Disclosing
                                        Party (at Disclosing Party’s expense) to
                                        assist Disclosing Party in obtaining a
                                        protective order and to prevent or
                                        minimize the disclosure of any
                                        Confidential Information, and Receiving
                                        Party may then disclose Confidential
                                        Information only if, and to the extent,
                                        required by law.
                                      </li>
                                      <li>
                                        Miscellaneous. Nothing herein shall be
                                        construed so as to prevent a Disclosing
                                        Party from disclosing to others its own
                                        Confidential Information. Either Party
                                        may disclose the existence and general
                                        nature of this Agreement, but may not,
                                        without the prior consent of the other
                                        Party, disclose the specific terms of
                                        this Agreement. SAI may mention Client’s
                                        name and provide a general description
                                        of the Subscription Services in SAI’s
                                        client lists or marketing materials. The
                                        obligations of confidentiality under
                                        this Section shall survive termination
                                        of the Agreement for a period of five
                                        (5) years from the date of termination.
                                      </li>
                                    </li>
                                  </ol>
                                </li>
                                <br />
                                <li>
                                  <strong>General Provisions.</strong>
                                  <ol type="a">
                                    <br />
                                    <li>
                                      <u> Assignment.</u> Neither Party shall
                                      assign or transfer this Agreement or any
                                      of the rights granted by this Agreement,
                                      without obtaining the other Party’s
                                      written approval, such approval not to be
                                      unreasonably withheld whether by operation
                                      of law or otherwise; provided, however,
                                      that in the event of a sale of all or
                                      substantially all of the assets of either
                                      Party as a going concern to another
                                      entity, or merger or consolidation with or
                                      into another entity which shall continue
                                      that Party’s business substantially
                                      unchanged, the successor entity shall,
                                      upon written notice to the other Party and
                                      assumption in writing of the assigning
                                      Party’s obligations under this Agreement,
                                      be entitled to the benefits granted
                                      herein, subject to all of the other terms
                                      and conditions of this Agreement. No Third
                                      Party Beneficiaries. This Agreement is
                                      entered into solely for the respective
                                      benefit of the Parties and their permitted
                                      successors and assigns, and nothing in
                                      this Agreement will be construed as giving
                                      any right, remedy or claim under this
                                      Agreement to an entity other than the
                                      Parties to this Agreement, persons and
                                      entities expressly indemnified hereunder
                                      and each of their permitted successors and
                                      permitted assigns.
                                    </li>
                                    <li>
                                      <u>Force Majeure.</u> Except for an
                                      obligation to make a payment of fees
                                      hereunder, neither Party shall be
                                      responsible for any delay or failure in
                                      performance resulting from occurrences
                                      beyond its reasonable control, including
                                      acts of God, war, terrorism, riot or other
                                      civil disturbance; outages of electrical,
                                      telecommunications or computer server
                                      hosting services; acts of government;
                                      non-cooperation of the other Party where
                                      necessary; or labor strikes or lockouts.
                                      The affected Party’s performance shall be
                                      excused and the time for performance shall
                                      be extended for the period of delay or
                                      inability to perform due to such
                                      occurrence, provided that, in order to be
                                      excused from delay or failure to perform,
                                      such Party shall promptly notify the other
                                      Party of the anticipated delay and the
                                      steps proposed to be undertaken to
                                      mitigate the effects of the delay.
                                      <li>
                                        <u> Relationship of the Parties.</u> The
                                        relationship of the Parties shall be
                                        that of independent contractors. Nothing
                                        herein shall be construed to create any
                                        agency, partnership, joint venture or
                                        similar relationship or to subject the
                                        Parties to any implied duties or
                                        obligations respecting the conduct of
                                        their affairs which are not expressly
                                        stated herein. Neither Party shall have
                                        any right or authority to assume or
                                        create any obligation or responsibility,
                                        either express or implied, on behalf of
                                        or in the name of the other Party, or to
                                        bind the other Party in any matter or
                                        thing whatsoever.
                                      </li>
                                      <li>
                                        <u> Governing Law and Arbitration.</u>{" "}
                                        This Agreement shall be governed by and
                                        interpreted in accordance with the laws
                                        of the State of Illinois, but without
                                        giving effect to any choice of law or
                                        other principles which might otherwise
                                        make the laws of a different
                                        jurisdiction govern or apply. The terms
                                        in this document shall govern all the
                                        rights and obligations of the parties,
                                        notwithstanding any provision of the
                                        Convention on Contracts for the
                                        International Sale of Goods to the
                                        contrary. The Parties hereto agree that
                                        any and all disputes or claims arising
                                        hereunder shall be settled by binding
                                        arbitration in accordance with the
                                        Commercial Arbitration Rules of the
                                        American Arbitration Association. Any
                                        arbitration will be conducted in
                                        Chicago, Illinois. The arbitrator’s
                                        decision must set forth a reasoned basis
                                        for any award of damages or finding of
                                        liability and shall be final and
                                        binding. Any arbitration award
                                        (including reasonable attorney’s fees
                                        and related expenses for the prevailing
                                        Party) may be entered in and enforced by
                                        any court having jurisdiction thereof,
                                        and the Parties consent and commit
                                        themselves to the jurisdiction of the
                                        courts of the State of Illinois for
                                        purposes of any enforcement of any
                                        arbitration award. Except as may be
                                        required by law, neither a Party nor an
                                        arbitrator may disclose the existence,
                                        content, or results of any arbitration
                                        hereunder without the prior written
                                        consent of both Parties.
                                      </li>
                                      <li>
                                        {" "}
                                        <u>Counterparts.</u> This Subscription
                                        Agreement in its entirety may be
                                        executed in several counterparts, all of
                                        which taken together shall constitute
                                        one single agreement between the
                                        parties. If electronic signatures are
                                        used for this purpose, either party may
                                        print out the faxed or imaged version of
                                        the Subscription Agreement signed by the
                                        other party and then sign in the
                                        designated space.
                                      </li>
                                      <li>
                                        {" "}
                                        <u>Electronic Signatures.</u> This
                                        Subscription Agreement may be signed
                                        electronically by aced signature or by
                                        an exchange of electronically imaged
                                        signatures (e.g., Adobe PDF format).
                                        Signing and submitting this Agreement
                                        electronically or by facsimile or as an
                                        imaged file will apply just as if the
                                        parties physically signed a paper
                                        document.
                                      </li>
                                      <li>
                                        <u>Contract Interpretation.</u> The
                                        Agreement, including Order From,
                                        constitute the entire agreement between
                                        the Parties, and upon execution and
                                        delivery supersedes all prior oral or
                                        written agreements or communications,
                                        with regard to the subject matter
                                        described herein. The Subscription
                                        Agreement may not be modified except in
                                        writing, signed by both parties. In the
                                        event any provisions of the Agreement
                                        are held to be unenforceable or invalid,
                                        the validity or enforceability of the
                                        remaining provisions shall not be
                                        affected, and the Subscription Agreement
                                        shall be construed in all respects as if
                                        the invalid or unenforceable provisions
                                        are omitted. No failure or delay of any
                                        party in exercising any right under the
                                        Subscription Agreement shall operate as
                                        a waiver. No waiver of any breach shall
                                        be effective unless contained in
                                        writing, signed by both parties.
                                      </li>
                                    </li>
                                  </ol>
                                </li>
                              </ol>

                              <br />
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {/* <FormControlLabel
                            control={
                              <Checkbox
                                checked={isAgreed}
                                onChange={(e) => setIsAgreed(e.target.checked)}
                              />
                            }
                            label="I agree to the terms and conditions."
                          /> */}
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={isPayAgreed}
                                      onChange={(e) =>
                                        setIsPayAgreed(e.target.checked)
                                      }
                                    />
                                  }
                                  label='By clicking here, I state that I have read and understood the "Subscriber Agreement"'
                                />
                              </Box>
                            </Box>
                          </AccordionDetails>
                        </Accordion>

                        {isPayAgreed && (
                          <>
                            <Accordion
                              expanded={expanded}
                              onChange={handleAccordionChange}
                            >
                              <AccordionSummary
                                sx={{
                                  "& .MuiAccordionSummary-expandIconWrapper": {
                                    transform: "none !important", // Prevent rotation for check icon
                                  },
                                }}
                                // Toggle between the down/up arrow based on the expanded state
                                expandIcon={
                                  isAgreed ? (
                                    <CheckIcon color="success" /> // Check icon when isAgreed is true
                                  ) : expanded ? (
                                    <ArrowUpwardIcon /> // Up arrow when expanded
                                  ) : (
                                    <ArrowDownwardIcon /> // Down arrow when collapsed
                                  )
                                }
                                aria-controls="panel2-content"
                                id="panel2-header"
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    mb: 2,
                                    fontWeight: 600,
                                    // background:
                                    //   "linear-gradient(to right, #2ca6af, #109fb3, #0098b6, #0090b8, #0488b9)",
                                    padding: "10px",
                                    borderRadius: "5px",

                                    // color: "#fff",
                                  }}
                                >
                                  SAI Order Form - Exhibit A
                                </Typography>
                              </AccordionSummary>
                              <Typography variant="body1" sx={{ ml: 2 }}>
                                Programs, Services, Pricing &amp; Term. Services
                              </Typography>
                              <AccordionDetails>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Table
                                    sx={{
                                      border: "1px solid black",
                                      width: "80%",
                                      borderCollapse: "collapse",
                                    }}
                                  >
                                    <TableHead>
                                      <TableRow>
                                        <TableCell
                                          colSpan={1}
                                          sx={{
                                            border: "1px solid black",
                                            width: "50%",
                                            // backgroundColor: "#f2f2f2",
                                          }}
                                        >
                                          App Name
                                        </TableCell>
                                        <TableCell
                                          colSpan={3}
                                          sx={{
                                            border: "1px solid black",
                                            textAlign: "center",
                                            fontWeight: "bold",
                                            width: "50%",
                                            // backgroundColor: "#f2f2f2",
                                          }}
                                        >
                                          SIDDHA PI
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell
                                          colSpan={1}
                                          sx={{
                                            border: "1px solid black",
                                            width: "50%",
                                            // backgroundColor: "#f2f2f2",
                                          }}
                                        >
                                          Plan Type
                                        </TableCell>
                                        <TableCell
                                          colSpan={3}
                                          sx={{
                                            border: "1px solid black",
                                            textAlign: "center",
                                            fontWeight: "bold",
                                            width: "50%",
                                            // backgroundColor: "#f2f2f2",
                                          }}
                                        >
                                          {sessionStorage.getItem(
                                            "selectedPlanName")}
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>

                                    <TableBody>
                                      <TableRow>
                                        <TableCell
                                          colSpan={1}
                                          sx={{
                                            border: "1px solid black",
                                            width: "50%",
                                          }}
                                        >
                                          Selected Plan Cost
                                        </TableCell>
                                        <TableCell
                                          colSpan={1}
                                          sx={{
                                            textAlign: "right",
                                            border: "1px solid black",
                                            fontWeight: "bold",
                                            width: "50%",
                                          }}
                                        ></TableCell>{" "}
                                        <TableCell
                                          colSpan={2}
                                          sx={{
                                            textAlign: "right",
                                            border: "1px solid black",
                                            fontWeight: "bold",
                                            width: "50%",
                                          }}
                                        >
                                          {couponResponse?.clientSelectedPrice}
                                        </TableCell>
                                      </TableRow>

                                      <TableRow>
                                        <TableCell
                                          colSpan={1}
                                          sx={{
                                            border: "1px solid black",
                                            width: "50%",
                                          }}
                                        >
                                          Number of Providers
                                        </TableCell>
                                        <TableCell
                                          colSpan={1}
                                          sx={{
                                            textAlign: "right",
                                            border: "1px solid black",
                                            fontWeight: "bold",
                                            width: "50%",
                                          }}
                                        ></TableCell>{" "}
                                        <TableCell
                                          colSpan={2}
                                          sx={{
                                            textAlign: "right",
                                            border: "1px solid black",
                                            fontWeight: "bold",
                                            width: "120%",
                                          }}
                                        >
                                          {sessionStorage.getItem(
                                            "nofprovider"
                                          )}
                                        </TableCell>
                                      </TableRow>

                                      <TableRow>
                                        <TableCell
                                          colSpan={1}
                                          sx={{
                                            border: "1px solid black",
                                            width: "50%",
                                          }}
                                        >
                                          Cost Per Month
                                        </TableCell>
                                        <TableCell
                                          colSpan={1}
                                          sx={{
                                            textAlign: "right",
                                            border: "1px solid black",
                                            fontWeight: "bold",
                                            width: "50%",
                                          }}
                                        ></TableCell>{" "}
                                        <TableCell
                                          colSpan={2}
                                          sx={{
                                            textAlign: "right",
                                            border: "1px solid black",
                                            fontWeight: "bold",
                                            width: "50%",
                                          }}
                                        >
                                          {couponResponse?.CostPerMonth}
                                        </TableCell>
                                      </TableRow>

                                      <TableRow>
                                        <TableCell
                                          colSpan={1}
                                          sx={{
                                            border: "1px solid black",
                                            width: "50%",
                                          }}
                                        >
                                          Promotional Offer
                                        </TableCell>
                                        <TableCell
                                          colSpan={1}
                                          sx={{
                                            textAlign: "right",
                                            border: "1px solid black",
                                            fontWeight: "bold",
                                            width: "50%",
                                          }}
                                        ></TableCell>
                                        <TableCell
                                          colSpan={2}
                                          sx={{
                                            textAlign: "right",
                                            border: "1px solid black",
                                            fontWeight: "bold",
                                            width: "50%",
                                          }}
                                        >
                                          {
                                            couponResponse?.PromotionalCostAmount
                                          }
                                        </TableCell>
                                      </TableRow>

                                      <TableRow>
                                        <TableCell
                                          colSpan={1}
                                          sx={{
                                            width: "50%",
                                            borderLeft: "1px solid #fff",
                                            borderBottom: "1px solid #fff",
                                          }}
                                        ></TableCell>
                                        <TableCell
                                          colSpan={1}
                                          sx={{
                                            fontWeight: "bold",
                                            border: "1px solid black",
                                            width: "50%",
                                          }}
                                        >
                                          Recurring Total Cost Per Month
                                        </TableCell>
                                        <TableCell
                                          colSpan={2}
                                          sx={{
                                            textAlign: "right",
                                            border: "1px solid black",
                                            fontWeight: "bold",
                                            width: "50%",
                                          }}
                                        >
                                          {couponResponse?.TotalCostPerMonth}
                                        </TableCell>
                                      </TableRow>

                                      <TableRow>
                                        <TableCell
                                          colSpan={1}
                                          sx={{
                                            width: "50%",
                                            borderLeft: "1px solid #fff",
                                            borderBottom: "1px solid #fff",
                                          }}
                                        ></TableCell>
                                        <TableCell
                                          colSpan={1}
                                          sx={{
                                            border: "1px solid black",
                                            width: "50%",
                                          }}
                                        >
                                          One Time Set Up Fee
                                        </TableCell>
                                        <TableCell
                                          colSpan={2}
                                          sx={{
                                            textAlign: "right",
                                            border: "1px solid black",
                                            fontWeight: "bold",
                                            width: "50%",
                                          }}
                                        >
                                          $500
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </Box>

                                <br />
                                <Box>
                                  <Typography>
                                    The one time Set-Up Fee{" "}
                                    <strong>($500)</strong> is due upon
                                    execution of this Subscription Agreement.
                                    SAI will provide the set up services only
                                    upon receipt of the one-time fee. The Total
                                    Fees are due and payable in accordance with
                                    Section 4 of the Subscription Agreement.
                                  </Typography>
                                  <br />
                                  <Typography>
                                    Term: The Term of this Order Form shall
                                    commence on the date on which SAI first
                                    makes the Subscription Services available to
                                    the Subscriber and shall continue for the
                                    Trial Term. Thereafter, the Order Form will
                                    renew on a month-to-month basis upon payment
                                    of the monthly fee, unless terminated
                                    pursuant to the Subscription Agreement or
                                    this Order Form has been superseded by a new
                                    order form. The per-month pricing is subject
                                    to change upon sixty (60) days’ notice.
                                  </Typography>
                                  <br />
                                  <Typography>
                                    General: SAI may revise and update the
                                    Subscription Services from time to time. If
                                    Client wishes to upgrade to a new version,
                                    Client will pay the additional fee
                                    associated with such upgrade.
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    padding: "15px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={isAgreed}
                                        onChange={(e) =>
                                          setIsAgreed(e.target.checked)
                                        }
                                      />
                                    }
                                    label="I agree, above information is correct"
                                  />
                                </Box>

                                {isAgreed && (
                                  <>
                                    {/* <Typography>
                                    Agreement Confirmation
                                  </Typography> */}

                                    <Box sx={{ mt: 2 }}>
                                      {/* Agreement Confirmation Text */}
                                      <Typography>
                                        <strong>IN WITNESS WHEREOF,</strong> the
                                        parties have executed and delivered this
                                        Agreement as of the Effective Date.{" "}
                                        <br />
                                        <br /> <strong>Client</strong>
                                      </Typography>

                                      {/* Name and Title Fields */}
                                      <Grid
                                        container
                                        spacing={2}
                                        sx={{ mt: 1 }}
                                      >
                                        <Grid item xs={12} sm={6}>
                                          <TextField
                                            id="name"
                                            label="Name"
                                            fullWidth
                                            margin="normal"
                                            value={name}
                                            error={!!nameError}
                                            helperText={nameError}
                                            onChange={(e) =>
                                              setName(e.target.value)
                                            }
                                            onBlur={() =>
                                              setNameError(
                                                validateField(name, "Name", 3) // Validate with 3 character minimum
                                              )
                                            }
                                          />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                          <TextField
                                            id="title"
                                            label="Title"
                                            fullWidth
                                            margin="normal"
                                            value={title}
                                            error={!!titleError}
                                            helperText={titleError}
                                            onChange={(e) =>
                                              setTitle(e.target.value)
                                            }
                                            onBlur={() =>
                                              setTitleError(
                                                validateField(title, "Title", 2) // Validate with 2 character minimum
                                              )
                                            }
                                          />
                                        </Grid>
                                      </Grid>

                                      {/* Signature Canvas and Clear Signature Button */}
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "start",
                                          mt: 3,
                                          width: "fit-content",
                                        }}
                                      >
                                        <Typography>Signature:</Typography>
                                        <SignatureCanvas
                                          ref={sigPad}
                                          penColor="black"
                                          canvasProps={{
                                            width: 500,
                                            height: 200,
                                            style: {
                                              border: "1px solid #000",
                                              backgroundColor: "lightgrey",
                                              borderRadius: "4px",
                                            },
                                          }}
                                        />
                                        <Button
                                          variant="outlined"
                                          onClick={handleClearSignature}
                                          sx={{ mt: 1, alignSelf: "start" }}
                                        >
                                          Clear Signature
                                        </Button>
                                      </Box>

                                      <Typography
                                        style={{
                                          color: "#333",
                                          fontSize: "16px",
                                          lineHeight: "1.5",
                                          margin: "10px 0",
                                        }}
                                      >
                                        <strong>Note:</strong> To make a payment
                                        for Siddha - PI product purchase,
                                        proceed with continue. You will be
                                        redirected to the Stripe payment gateway
                                        to set up your bank account. Once your
                                        account is set up, you can view the
                                        Order summary of the selected Siddha PI
                                        - subscription plan and make a payment.
                                      </Typography>

                                      {/* Center-Aligned Back and Set Up Bank Account Buttons */}
                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "center",
                                          gap: 2,
                                          mt: 3,
                                        }}
                                      ></Box>
                                    </Box>
                                  </>
                                )}
                              </AccordionDetails>
                            </Accordion>
                          </>
                        )}

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            p: 1,
                          }}
                        >
                          <Button variant="outlined" onClick={handleBack}>
                            Back
                          </Button>
                          <Button
  variant="contained"
  onClick={handleSaveSignature}
  disabled={!isAgreed || !isPayAgreed} // Disable if either condition is false
  sx={{
    background: isAgreed && isPayAgreed
      ? "linear-gradient(to right, #2ca6af, #109fb3, #0090b8, #0090b8, #0488b9)"
      : "gray", // Change background color for disabled state
    color: isAgreed && isPayAgreed ? "white" : "rgba(255,255,255,0.7)", // Adjust text color
    cursor: isAgreed && isPayAgreed ? "pointer" : "not-allowed", // Indicate disabled state visually
  }}
>
  Continue
</Button>

                        </Box>
                        {/* Render the "Next" button only if both conditions are met */}
                        {isAgreed && isPayAgreed && signature && (
                          <Button
                            onClick={handlePayment} // Assuming this function handles the next step logic
                            variant="contained"
                            fullWidth
                            sx={{ mt: 2 }}
                          >
                            Next
                          </Button>
                        )}
                      </Box>
                    )}
                  </form>
                )}
              </Formik>
              <Toaster position="top-center" />
            </Box>
          ) : (
            <>
              <Typography variant="h5">{errorMessage}</Typography>
              <Grid
                container
                spacing={2}
                sx={{ mt: 3, mb: 2, minHeight: "300px" }}
              >
                <Grid item size={{ xs: 12, sm: 6, md: 12 }} />
                <img
                  src={ErrorUnAuth}
                  alt="Unauthorized"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    margin: "auto",
                    borderRadius: "8px",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    // console.error("Failed to load unauthorized image");
                  }}
                />
              </Grid>
            </>
          )}
        </Card>
      </Container>

      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <footer>
          <Typography
            variant="body2"
            color="textDisabled"
            sx={{ fontWeight: 600 }}
          >
            &copy; Siddha AI {new Date().getFullYear()}
          </Typography>
          <Typography sx={{ ml: 2 }} variant="body2" color="textDisabled">
            Version {ApplicationVersion}
          </Typography>
        </footer>
      </Box>
    </Box>
  );
}
