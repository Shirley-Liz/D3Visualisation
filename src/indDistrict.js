const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const bar = jinjaVillages => {
    const xValue = d => d.turbidity;
    const yValue = d => d.village;
    const margin = { top: 50, right: 40, bottom: 60, left: 200 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(jinjaVillages, xValue)])
        .range([0, innerWidth])
        .nice()


    console.log(xScale.range());
    console.log(xScale.domain());

    const yScale = d3.scaleBand()
        .domain(jinjaVillages.map(yValue))
        .range([0, innerHeight])
        .padding(0.1)


    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    g.append('g')
        .call(d3.axisLeft(yScale))
        .selectAll('.domain,.tick line')
        .remove();

    const yAxisG = g.append('g').call(d3.axisLeft(yScale));
    yAxisG.selectAll('.domain').remove();

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -130)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text('Villages in Mubende');

    const xAxisG = g.append('g').call(d3.axisBottom(xScale))
        .attr('transform', `translate(0, ${innerHeight})`)

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', +50)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text('Turbidity')

    g.selectAll('rect').data(jinjaVillages)
        .enter().append('rect')
        .attr('y', d => yScale(yValue(d)))
        .attr('width', d => xScale(xValue(d)))
        .attr('height', yScale.bandwidth())

    g.append('text')
        .attr('class', 'title-label')
        .attr('y', -20)
        .text('Turbidity Levels in the different villages of Lamwo District')
        .attr('fill', 'black')
}


const render = jinjaVillages => {

    bar(jinjaVillages)
}

d3.csv('/data/data1.csv').then(data => {
    // Step 2: Filter the data to select a subset
    const jinjaVillages = data.filter(d => d.District === 'Mubede');

    console.log("Villages in Jinja:", jinjaVillages);
    render(jinjaVillages);

}).catch(error => {
    console.log('Error loading CSV file:', error);

});