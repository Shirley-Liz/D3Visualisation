const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const drawBarChart = data => {
    const counts = {};
    data.forEach(d => {
        const district = d.District.trim();
        if (counts[district]) {
            counts[district]++;
        } else {
            counts[district] = 1;
        }
    });

    const barData = Object.keys(counts).map(key => ({
        district: key,
        count: counts[key]
    }));

    const margin = { top: 40, right: 20, bottom: 70, left: 130 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(barData.map(d => d.district))
        .range([0, innerWidth])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(barData, d => d.count)])
        .range([innerHeight, 0]);

    const bars = g.selectAll('.bar')
        .data(barData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.district))
        .attr('y', d => yScale(d.count))
        .attr('width', xScale.bandwidth())
        .attr('height', d => innerHeight - yScale(d.count));

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(xAxis);

    g.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);

    g.append('text')
        .attr('class', 'axis-label')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + margin.bottom)
        .attr('text-anchor', 'middle')
        .text('Districts');

    g.append('text')
        .attr('class', 'axis-label')
        .attr('y', -60)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Number of villages');

    svg.append('text')
        .attr('class', 'title-label')
        .attr('x', width / 2)
        .attr('y', margin.top)
        .attr('text-anchor', 'middle')
        .text('Number of Villages by District');
};

d3.csv('/data/data1.csv').then(data => {
    drawBarChart(data);
});
