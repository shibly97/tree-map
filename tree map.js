let movieDataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
let movieData

d3.json(movieDataUrl).then(
    (data,error) =>{
    if (error){
        console.log(error)
    }else{
        movieData = data
        console.log(movieData)
        drawTreeMap()
    }
    })

let canvas = d3.select('#canverse') 
let tooltip = d3.select('#tooltip')

// *********** main case where it creates the placement and sizes of boxes ***********************

let drawTreeMap = () =>{

    let hierarchy = d3.hierarchy(movieData,(node)=>{
        return node['children']
    }).sum((node) =>{
        return node['value']
    }).sort((node1,node2) =>{
        return node2['value'] - node1['value']
    })
    

    let createTreeMap = d3.treemap()
    .size([1000, 600])
    
    createTreeMap(hierarchy)

    let movieTiles = hierarchy.leaves()
    console.log(movieTiles)

// ****************** main case over*************************************


    // bcz we need text inside rect we need to create a 'g' and append rect and text inside it. 
    // bcz we can not add text inside a rect
    let block = canvas.selectAll('g')
                      .data(movieTiles)
                      .enter()
                      .append('g')
                    //   setting all g in the correct positions
                      .attr('transform', (movie) =>{
                    //  y0 and x0 are genarate by moieTiles which we have created
                          return 'translate('+ movie['x0'] + ',' + movie['y0']+')'
                      })


    block.append('rect')
        .attr('class', 'tile')
        .attr('fill', (movie) =>{
            let category = movie['data']['category']
            if (category == 'Action'){
                return 'orange'
            }else if(category == 'Drama'){
                return 'lightgreen'
            }else if(category == 'Adventure'){
                return 'blue'
            }else if(category == 'Family'){
                return 'lightblue'
            }else if(category == 'Animation'){
                return 'pink'
            }else if(category == 'Comedy'){
                return 'khaki'
            }else if(category == 'Biography'){
                return 'tan'
            }
        })
        .attr('data-name',(movie)=>{
            return movie['data']['name']
        })
        .attr('data-category', (movie) =>{
            return movie['data']['category']
        })
        .attr('data-value', (movie) =>{
            return movie['data']['value']
        })
        .attr('width', (movie) =>{
            // x0 is the left point and x1 is the right point of the box. (so we can get the rect width 
            // by x1 - x0 = width)
            return movie['x1'] - movie['x0']
        })
        .attr('height',(movie) =>{
            // y0 is the top point and y1 is the bottom point of the box. (so we can get the rect height 
            // by y1 - y0 = height)
            return movie['y1'] - movie['y0'] 
        })
        .on('mouseover',(movie) =>{
            tooltip.transition()
                   .style('visibility', 'visible')
            tooltip.text('Name of the movie - ' + movie['data']['name']+ ' || Revenue - '+ movie['data']['value'])
            tooltip.attr('data-value', movie['data']['value']
            )
        })
        .on('mouseout',(movie)=>{
            tooltip.transition()
                    .style('visibility','hidden')
        })
    
    //now inside the 'g' we need a text element as well. but we cannot append it inside the rect. so we need to
    //call the 'g' again and append the text
    block.append('text')
         .text((movie =>{
             return movie['data']['name']
         }))
         .attr('x', 5)
         .attr('y', 15)
         .style('font-size', 10)

}
