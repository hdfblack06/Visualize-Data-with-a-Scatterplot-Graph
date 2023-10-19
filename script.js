function GetChart(){
    const width = 920;
    const height = 500;
    var chartHolder = d3.select("#chartHolder")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
    
    const JsonData = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
    fetch(JsonData)
    .then(response => response.json())
    .then(data => {
        const year = data.map(d=>{return d.Year})
        const maxYear = d3.max(year)
        const minYear = d3.min(year)
        //create axis X
        const xScale = d3.scaleLinear()
            .domain([minYear - 1, maxYear + 1])
            .range([0, width - 70]);
        const xAxis = d3.axisBottom()
            .tickFormat(d3.format("d"))
            .scale(xScale);
        chartHolder.append("g")
            .attr("id","x-axis")
            .attr('transform', 'translate(60, 510)')
            .call(xAxis);

        //create axis Y
        const time = data.map(t => {
            const parstTime = t.Time.split(":")
            return new Date(2023,9,17,0,parstTime[0],parstTime[1])
        });
        const maxTime = d3.max(time);
        const minTime = d3.min(time);
        
        const yScale = d3.scaleTime()
            .domain([minTime,maxTime])
            .range([0,height ])
        const timeFormat = d3.timeFormat('%M:%S');
        const yAxis = d3.axisLeft()
            .tickFormat(timeFormat)
            .scale(yScale)
        chartHolder.append("g")
            .attr("id","y-axis")
            .attr('transform', 'translate(60, 10)')
            .call(yAxis);
        //add TEXT
        chartHolder.append("text")
            .attr('transform', 'rotate(-90)')
            .attr('y', 20)
            .attr('x',-192)
            .style('font-size', 20)
            .style("fill","#006D77")
            .text("Time in Minutes")
        //rect
        const color = ["#E29578","#006D77"]
        d3.select("svg")
            .selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class","dot")
            .attr("r",6)
            .attr("data-xvalue",(dx)=>{return dx.Year})
            .attr("data-yvalue",(dy)=>{return time[dy.Place - 1]})
            .attr('transform', 'translate(60, 480)')
            .attr("cx",(cx)=>{return xScale(cx.Year)})
            .attr("cy",(cy)=>{return yScale(time[cy.Place - 1] ) - 470})
            .style('fill',(d)=>{return d.Doping !=="" ? color[1] : color[0]})
        
        //legend
        const legendContainer = chartHolder.append("g").attr("id","legend")
        legendContainer.append("rect")
            .attr("width",250)
            .attr("height",80)
            .attr("transform",`translate(${width - 250},${height / 2 - 20})`)
            .style("fill","#FFDDD2")
        const legendLabel = legendContainer.selectAll(".lagendLabel")
            .data(color)
            .enter()
            .append("g")
            .attr("class","legendLabel")
            .attr("transform", (d, i) => `translate(${width - 30}, ${height / 2 + 22 * i})`);
        legendLabel.append("rect")
            .attr("width",20)
            .attr("height",20)
            .style("fill",(d)=>{return d})
        legendLabel.append("text")
            .text((d,i)=>{
                if(i==0){return "No doping allegations"}
                else{return "Riders with doping allegations"}
            })
            .attr('transform', `translate(-5, 15)`)
            .style('text-anchor', 'end')
            .style("fill","#006D77")
            
    })
}
