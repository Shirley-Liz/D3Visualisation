const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const bar = data => {
    const xValue = d => d.turbidity;
    const yValue = d => d.District;
    const margin = { top: 50, right: 40, bottom: 60, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([0, innerWidth])
        .nice()


    console.log(xScale.range());
    console.log(xScale.domain());

    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1)


    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    g.append('g')
        .call(d3.axisLeft(yScale))
        .selectAll('.domain,.tick line')
        .remove();

    const xAxisG = g.append('g').call(d3.axisBottom(xScale))
        .attr('transform', `translate(0, ${innerHeight})`)

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', +50)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text('Turbidity')

    g.selectAll('rect').data(data)
        .enter().append('rect')
        .attr('class','.barrect')
        .attr('y', d => yScale(yValue(d)))
        .attr('width', d => xScale(xValue(d)))
        .attr('height', yScale.bandwidth())

    g.append('text')
        .attr('class', 'title-label')
        .attr('y', -20)
        .text('Turbidity Levels in the different districts')
        .attr('fill', 'black')
}
d3.csv('/data/data1.csv').then(data => {
    data.forEach(d => {
        d.turbidity = +d.turbidity;
    });
    console.log(data);
    bar(data);
}).catch(error => {
    console.log('Error loading CSV file:', error);
});