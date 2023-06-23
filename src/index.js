const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const stackedBar = data => {
    const districts = [...new Set(data.map(d => d.District))];
    const variables = ['turbidity', 'Flouride', 'Chloride'];

    const margin = { top: 50, right: 40, bottom: 60, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
        .domain(districts)
        .range([0, innerWidth])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.sum(variables, v => +d[v]))])
        .range([innerHeight, 0]);

    const colorScale = d3.scaleOrdinal()
        .domain(variables)
        .range(["#7fc97f", "#fdc086", "#386cb0", "#f0027f", "#666666"]);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const stack = d3.stack()
        .keys(variables)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    const stackedData = stack(data);

    g.selectAll('g')
        .data(stackedData)
        .enter().append('g')
        .attr('fill', d => colorScale(d.key))
        .selectAll('rect')
        .data(d => d)
        .enter().append('rect')
        .attr('x', d => xScale(d.data.District))
        .attr('y', d => yScale(d[1]))
        .attr('height', d => yScale(d[0]) - yScale(d[1]))
        .attr('width', xScale.bandwidth());

    console.log(stackedData);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const xAxisG = g.append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxis);

    const yAxisG = g.append('g')
        .call(yAxis);

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 40)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text('Districts');

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -60)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Value');

    g.selectAll('legend')
        .data(variables)
        .enter().append('rect')
        .attr('y', (d, i) => i * 20)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', d => colorScale(d));

    g.selectAll('legendLabels')
        .data(variables)
        .enter().append('text')
        .attr('y', (d, i) => i * 20 + 12)
        .attr('x', 20)
        .attr('fill', 'black')
        .text(d => d);
};

// Step 1: Load the CSV file
d3.csv('/data/data1.csv').then(data => {
    data.forEach(d => {
        d.turbidity = +d.turbidity;
        d.Flouride = +d.Flouride;
        d.Chloride = +d.Chloride;
    });
    console.log(data);
    stackedBar(data);
}).catch(error => {
    console.log('Error loading CSV file:', error);
});
