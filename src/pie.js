const sectionColors = [
    'olive', 'teal', 'Pink', 'coral', 'Grey', 'yellow', 'orange', 'wheat', 'lightgreen', 'aqua', 'seagreen'
]; // representation of states in different colors

// Function to fetch data from CSV
const fetchData = async () => {
    const data = await d3.csv('/data/data1.csv');
    data.forEach(d => {
        d.ElectricalConductivity = +d.ElectricalConductivity;
    });
    return data;
};

const svg = d3.select("svg");
const width = +svg.attr('width');
const height = +svg.attr('height');

const xAxisTickFormat = number =>
    d3.format('.4~g')(number);

const chartTitle = "ElectricalConductivity by District";

const render = (data) => {
    // Calculate total turbidity per district
    const districtData = d3.group(data, d => d.District);
    const aggregatedData = Array.from(districtData, ([key, values]) => ({
        District: key,
        pH: d3.sum(values, d => d.ElectricalConductivity)
    }));

    const pieData = d3.pie().value(d => d.ElectricalConductivity)(aggregatedData);
    const colors = d3.scaleOrdinal()
        .domain(aggregatedData.map(d => d.District))
        .range(sectionColors);

    const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(200); // Increase the outerRadius value to increase the size of the pies

    const sections = svg.append("g")
        .attr("transform", `translate(300,300)`) // Adjust the transform to center the chart
        .selectAll("path").data(pieData);

    sections.enter()
        .append("path")
        .attr("d", arcGenerator) // Use the arcGenerator for path "d" attribute
        .attr("fill", (d, i) => colors(i));

    const legends = svg.append("g")
        .attr("transform", "translate(500,100)")
        .selectAll(".legends").data(pieData);

    const legend = legends.enter().append("g").classed(".legends", true)
        .attr("transform", (d, i) => `translate(0,${(i + 1) * 30})`);

    legend.append("rect").attr("width", 20).attr("height", 20)
        .attr("fill", (d, i) => colors(i));

    legend.append("text")
        .attr("x", 25)
        .attr("y", 15)
        .attr("class", "legend_text")
        .text(d => d.data.District);

    legend.append("text")
        .attr("x", 250)
        .attr("y", 15)
        .attr("class", "legend_value")
        .text(d => xAxisTickFormat(d.data.ElectricalConductivity));

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text(chartTitle);
};

const run = async () => {
    const data = await fetchData();
    render(data);
};

run();
