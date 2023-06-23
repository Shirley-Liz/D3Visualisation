const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const scatterPlot = data => {
    const xValue = d => d.ecoli;
    const yValue = d => d.turbidity;
    const margin = { top: 60, right: 50, bottom: 70, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const circleRadius = 7;
    const xAxisLabel = 'ecoli'
    const yAxisLabel = 'turbidity'
    const title = 'Turbidity and ecoli'

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
        .nice();

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(15);

    const yAxis = d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickPadding(10);

    const yAxisG = g.append('g').call(yAxis);
    yAxisG.selectAll('.domain', '.tick line').remove();

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -50)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);

    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`);

    xAxisG.select('.domain').remove();

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 50)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabel);

    g.selectAll('circle').data(data)
        .enter().append('circle')
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', circleRadius);

    g.append('text')
        .attr('class', 'title-label')
        .attr('y', -10)
        .text(title);
};



const scatterPlot1 = data => {
    const xValue = d => d.Longitude;
    const yValue = d => d.Latitude;
    const margin = { top: 50, right: 40, bottom: 60, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
        .nice();

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(15);

    const yAxis = d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickPadding(10);

    const yAxisG = g.append('g').call(yAxis);
    yAxisG.selectAll('.domain').remove();

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -50)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);

    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`);

    xAxisG.select('.domain').remove();

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 50)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabel);


    g.append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(xValue(d)))
        .attr("cy", d => yScale(yValue(d)))
        .attr("r", 4);

    g.append("text")
        .attr("class", "title-label")
        .attr("x", innerWidth / 2)
        .attr("y", -20)
        .attr("fill", "black")
        .text("Geographical Coordinates (Latitude and Longitude)");
};
d3.csv('/data/data1.csv').then(data => {
   
    console.log(data);
    scatterPlot(data);
}).catch(error => {
    console.log('Error loading CSV file:', error);
});
