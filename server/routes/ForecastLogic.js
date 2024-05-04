
let alpha = 0.5; // Smoothing parameter for level
let beta = 0.1; // Smoothing parameter for trend
let gamma = 0.1; // Smoothing parameter for seasonality
let seasonalPeriod = 6; // Seasonal period (e.g., 12 for monthly data)

// Train Holt-Winters model
function trainHoltWinters(data) {
    // console.log("data: ",data)
    // Initialize initial level, trend, and seasonal components
    let level = data[0];
    let trend = 0;
    let seasonal = Array.from({ length: seasonalPeriod }, () => 0);

    // Iterate over data to update components
    for (let i = 0; i < data.length; i++) {
        let value = data[i];
        let lastLevel = level;
        let lastTrend = trend;

        // Update level component
        level = alpha * value + (1 - alpha) * (lastLevel + lastTrend);

        // Update trend component
        trend = beta * (level - lastLevel) + (1 - beta) * lastTrend;

        // Update seasonal component
        seasonal[i % seasonalPeriod] = gamma * (value - lastLevel - lastTrend) + (1 - gamma) * seasonal[i % seasonalPeriod];
    }

    // Forecast future values
    const forecast = new Array(new Date().getMonth()+1).fill(0);
    for (let i = 0; i < 4; i++) { // Forecasting for the next 4 months
        let futureLevel = level + trend * (i + 1);
        let futureSeasonal = seasonal[(data.length + i) % seasonalPeriod];
        forecast.push(Math.trunc(futureLevel + futureSeasonal));
    }

    // Use the forecasted values as needed
    return ('Forecasted values:', forecast);
}

// Example usage
//const data = [10, 20, 30, 40, 50, 60]; // Example time series data (6 months)
module.exports= trainHoltWinters