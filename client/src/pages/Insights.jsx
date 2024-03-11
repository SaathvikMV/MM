import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useMemo } from "react";
import Navbar from "../components/Navbar";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarController,
  BarElement,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement
);
function Insights() {
  const [Backdata, setBackdata] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [user, setUser] = useState("");
  const [AuthUser, setAuthUser] = useState(false);
  const [chartData, setChartData] = useState({});
  const [paymentChartData, setPaymentChartData] = useState({});
  const [noData, setNoData] = useState(false);
  const [lineChartData, setLineChartData] = useState({});
  const [lineChartOptions, setLineChartOptions] = useState({});
  const [DisplayMonth, setDisplayMonth] = useState("");
  const [DisplayYear, setDisplayYear] = useState("2024");
  const [noLineData, setNoLineData] = useState(false);
  const [addbudget, setAddbudget] = useState();

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const headers = {
            Authorization: `Bearer ${token}`,
          };

          const response = await axios.get(
            "http://localhost:5000/:user/insights",
            {
              headers,
            }
          );

          setBackdata(response.data.data);
          createChartData(response.data.data);
          createPaymentChartData(response.data.data);
          createLineChartData(response.data.data);
          setUser(response.data.name);

          setAuthUser(true);
        } else {
          console.error("Token not found");
          setAuthUser(false);
        }
      } catch (error) {
        setAuthUser(false);
        console.error("Error fetching data:", error);
      }
    };

    handleFetchData();
  }, []); // Dependency on Backdata

  const createChartData = (data) => {
    const categories = {};
    data.forEach((entry) => {
      const category = entry.category;
      categories[category] = (categories[category] || 0) + entry.Amount;
    });

    const chartData = {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
            "rgba(255, 159, 64, 0.7)",
            "rgba(255, 0, 0, 0.7)", // Additional color
          ],
          hoverBackgroundColor: [
            "rgba(255, 99, 132, 0.9)",
            "rgba(54, 162, 235, 0.9)",
            "rgba(255, 206, 86, 0.9)",
            "rgba(75, 192, 192, 0.9)",
            "rgba(153, 102, 255, 0.9)",
            "rgba(255, 159, 64, 0.9)",
            "rgba(255, 0, 0, 0.9)", // Additional hover color
          ],
        },
      ],
    };

    setChartData(chartData);
    // Check if there is data for the applied filter
    setNoData(data.length === 0);
  };

  const createPaymentChartData = (data) => {
    const paymethod = {};
    data.forEach((entry) => {
      const paycategory = entry.payment_method;
      paymethod[paycategory] = (paymethod[paycategory] || 0) + entry.Amount;
    });

    const paymentChartData = {
      labels: Object.keys(paymethod),
      datasets: [
        {
          data: Object.values(paymethod),
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
            "rgba(255, 159, 64, 0.7)",
            "rgba(255, 0, 0, 0.7)", // Additional color
          ],
          hoverBackgroundColor: [
            "rgba(255, 99, 132, 0.9)",
            "rgba(54, 162, 235, 0.9)",
            "rgba(255, 206, 86, 0.9)",
            "rgba(75, 192, 192, 0.9)",
            "rgba(153, 102, 255, 0.9)",
            "rgba(255, 159, 64, 0.9)",
            "rgba(255, 0, 0, 0.9)", // Additional hover color
          ],
        },
      ],
    };

    setPaymentChartData(paymentChartData);
    // Check if there is data for the applied filter
    setNoData(data.length === 0);
  };

  // Function to create line chart data
  const createLineChartData = (data) => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const monthlyData = months.map((month) => {
      const filteredData = data.filter((entry) => {
        const entryDate = new Date(entry.date);
        const entryMonth = entryDate.getMonth() + 1;
        const entryYear = entryDate.getFullYear();
        return entryMonth === month && entryYear === parseInt(selectedYear);
      });

      const totalAmount = filteredData.reduce(
        (sum, entry) => sum + entry.Amount,
        0
      );
      return totalAmount;
    });
    const zeroData = Array(months.length).fill(0);

    const updatedLineChartData = {
      labels: months.map((month) => {
        // Format the month labels as desired (e.g., "Jan", "Feb", etc.)
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
        return monthNames[month - 1];
      }),
      datasets: [
        {
          label: "Monthly Expenses",
          data: monthlyData,
          backgroundColor: "rgba(75,192,192,0.7)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
          type: "bar", // Set type to "bar" for the bar chart
        },
        {
          label: "Monthly Expenses (Predicted)",
          data: zeroData,
          borderColor: "rgba(255, 0, 0, 1)",
          borderWidth: 2,
          fill: false,
          type: "line", // Set type to "line" for the line chart
        },
      ],
    };

    setLineChartData(updatedLineChartData);

    // Check if the total amount for all months is 0
    setNoLineData(monthlyData.every((amount) => amount === 0));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update the state based on the input name
    if (name === "month") {
      setSelectedMonth(value);
    } else if (name === "year") {
      setSelectedYear(value);
    }else if(name==="addbudget"){
      setAddbudget(value)
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // Format the selectedMonth for display
    const formattedMonth = new Date(selectedMonth + "-01");
    const displayMonth = formattedMonth.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    // Update the state
    setSelectedMonth(selectedMonth);
    setDisplayMonth(displayMonth);

    try {
      // Perform filtering based on selectedMonth
      const filteredData = Backdata.filter((entry) => {
        const entryDate = new Date(entry.date);
        const entryMonth = entryDate.getMonth() + 1;
        const entryYear = entryDate.getFullYear();

        const selectedDate = new Date(selectedMonth + "-01"); // Assuming selectedMonth is in the format 'YYYY-MM'
        const selectedMonthValue = selectedDate.getMonth() + 1;
        const selectedYear = selectedDate.getFullYear();

        return entryMonth === selectedMonthValue && entryYear === selectedYear;
      });

      createChartData(filteredData);
      createPaymentChartData(filteredData);
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  const clearFilter = () => {
    setSelectedMonth("");
    setDisplayMonth("");
    createChartData(Backdata);
    createPaymentChartData(Backdata);
  };

  const handleYearSubmit = (event) => {
    event.preventDefault();
    setDisplayYear(selectedYear);
    // Call the function to create line chart data
    createLineChartData(Backdata);
  };

  async function handleBudgetSubmit (event) {
    event.preventDefault();
    console.log(addbudget);
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const res = await axios.post(
          `http://localhost:5000/${user}/dashboard/addbudget`,
          {
            budget: addbudget,
          },
          {
            headers,
          }
        );
        console.log(res);

        if (res.data && res.data.error) {
          toast.error(res.data.error, {
            duration: 3000,
            position: "bottom-right",
          });
        } else if (res.data) {
          toast.success(res.data.message, {
            duration: 3000,
            position: "bottom-right",
          });
        }
      } else {
        console.log("Token not available!!");
      }
    } catch (e) {
      console.log(e);
      toast.error("An unexpected error occured", {
        duration: 3000,
        position: "bottom-right",
      });
    }
  };

  return (
    <>
    <Toaster/>
      <head>
        <link rel="icon" type="image/png" href="/landing_page/rupee.png" />
        <title>PennyWise-Insights</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        />
        <link rel="stylesheet" href="/Smart_Insights/main.css" />
        
      </head>
      <body>
        <Navbar user={user} />

        <div className="head container">
          <h1>Smart Insights</h1>
        </div>
        <div className="second">
          <form onSubmit={handleFormSubmit} className="inp-form">
            <label for="item">Month</label>
            <input
              type="month"
              id="start"
              name="month"
              min="2023-01"
              value={selectedMonth}
              onChange={handleChange}
            />

            <button className="inp-but">+</button>
          </form>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className="inp-but" onClick={clearFilter}>
              Clear filter
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
  <div style={{ maxWidth: "550px", margin: "auto" }}>
    <h3 className="cat-text">
      Category wise breakup of{" "}
      {DisplayMonth ? DisplayMonth : "all the expenses"}
    </h3>
    {noData ? (
      <p
        style={{
          color: "black",
          display: "flex",
          justifyContent: "center",
        }}
      >
        No data available for the selected filter.
      </p>
    ) : (
      chartData.labels && (
        <div style={{ background: "white" }}>
          <Doughnut
            data={chartData}
            height={200} // Set the height as needed
            width={200}  // Set the width as needed (same as height for equal size)
          />
        </div>
      )
    )}
  </div>

  <div style={{ maxWidth: "550px", margin: "auto" }}>
    <h3 className="cat-text">
      Payment wise breakup of{" "}
      {DisplayMonth ? DisplayMonth : "all the expenses"}
    </h3>
    {noData ? (
      <p
        style={{
          color: "black",
          display: "flex",
          justifyContent: "center",
        }}
      >
        No data available for the selected filter.
      </p>
    ) : (   
      chartData.labels && (
        <div style={{ background: "white" }}>
          <Doughnut
            data={paymentChartData}
            height={200} // Set the height as needed
            width={200}  // Set the width as needed (same as height for equal size)
          />
        </div>
      )
    )}
  </div>
</div>


        </div>

        <div
          className="container-fluid third"
          style={{
            backgroundColor: "#401c64",
            paddingTop: "50px",
            paddingBottom: "75px",
            color: "white",
          }}
        >
          <h3 className="cat-text">Month wise breakup of {DisplayYear}</h3>
          <form onSubmit={handleYearSubmit} className="inp-form">
            <label for="item">Year</label>
            <input
              type="number"
              id="start"
              name="year"
              value={selectedYear}
              onChange={handleChange}
            />

            <button className="inp-but" type="submit">
              Apply filter
            </button>
          </form>
          <div
            style={{ maxWidth: "800px", margin: "auto", background: "white" }}
          >
            {noLineData ? (
              <p
                style={{
                  color: "black",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                No data available for the selected filter.
              </p>
            ) : (
              lineChartData.labels && (
                <Line
                  data={lineChartData}
                  options={{
                    responsive: true,
                  }}
                  height={100} // Set the height as needed
                  width={200} // Set the width as needed
                />
              )
            )}
          </div>
        </div>
        <div>
        <form onSubmit={handleBudgetSubmit} className="inp-form">
            <label for="item">Budget</label>
            <input
              type="number"
              id="budget"
              name="addbudget"
              value={addbudget}
              onChange={handleChange}
            />

            <button className="inp-but" type="submit">
              Add
            </button>
          </form>
        </div>

        {/* links to other pages */}
        <div className="forth">{/* ... */}</div>

        {/* Hidden elements */}
        <div id="hidden" className="hidden" hidden>
          <span id="monthlyExpenses"></span>
          <span id="piechart"></span>
        </div>

        <script
          src="https://kit.fontawesome.com/1465e7da9e.js"
          crossOrigin="anonymous"
        ></script>
      </body>
    </>
  );
}

export default Insights;
