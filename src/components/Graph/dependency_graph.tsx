import React, { FC, useEffect, useRef, useState } from 'react';
import * as d3 from "d3";
 interface chartDataPorps {
  uniqueGraph:graphProps[];
  uniqueNodeArray:nodeArrayProps [];
}
interface graphPlotPorps {
  data: chartDataPorps;
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  children?: React.ReactNode;
}
// 定义返回数据graph接口
interface graphProps {
  source: any,
  target: any,
  type: number,
}
// 定义返回数据node接口
interface nodeArrayProps {
  id: string,
  weight: number,
  type: number
}
const LinePlot:React.FC<graphPlotPorps> = (props) => {
  let {
    data,
    width = 2000,
    height = 1400,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 20,
    marginLeft = 20 } = props;
    const svgRef = useRef(null);
    const [dataToRender, setDataToRender] = useState(data);
    const [shouldRender, setShouldRender] = useState(true);
    useEffect(
      () => {
      setDataToRender(data);
      d3.select(svgRef.current).selectAll("*").remove();
      console.log(111,data);
        const { uniqueGraph, uniqueNodeArray } = data;
        console.log(uniqueGraph,uniqueNodeArray)
        const types = Array.from(new Set(uniqueNodeArray.map((d:any) => d.type)));
        const links = uniqueGraph.map(d => Object.create(d))
        const gdefs = d3.create("svg:defs");
        const gLink = d3.create("svg:g");
        const gNode = d3.create("svg:g");
        var nominal_stroke = 1.5;
        const simulation = d3.forceSimulation(uniqueNodeArray.map(node => node as d3.SimulationNodeDatum))
          .force("link", d3.forceLink(uniqueGraph).id((d:any) => d.id))
          .force("charge", d3.forceManyBody().strength(-400))
          .force("x", d3.forceX())
          .force("y", d3.forceY());
        const zoom = d3.zoom()
          .scaleExtent([1, 10]) // 设置缩放范围，1 表示原始大小，10 表示最大放大为原始大小的10倍
          .on("zoom", (d3:any) => zoomed(d3));
        const color = d3.scaleOrdinal(types, d3.schemeCategory10);
  
  
        const svg = d3.select(svgRef.current)
          .attr("viewBox", [-width / 2, -height / 2, width, height])
          .attr("width", width)
          .attr("height", height)
          .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif;")
          .call(zoom as d3.ZoomBehavior<any, any>)
  
        // 在 useEffect 中选择 <g> 和 <defs> 元素
        svg.append(() => gdefs.node());
        const g = svg.append(() => gLink.node());
        const node_ = svg.append(() => gNode.node());
        // 创建 <defs> 元素并添加 <marker>
        gdefs.selectAll("marker")
          .data(types) // 使用 data() 方法绑定数据
          .join("marker") // 根据数据绑定状态对元素进行操作
          .attr("id", (d:any) => `arrow-${d}`)
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 15)
          .attr("refY", -0.5)
          .attr("markerWidth", 6)
          .attr("markerHeight", 6)
          .attr("orient", "auto") // 定义图形在路径上的朝向： auto-浏览器会自动根据路径的朝向来调整图形的朝向。
          .append("path") // append 添加 用于绘制路径，例如曲线、线段等。主要用于箭头
          .attr("fill", color)
          .attr("d", "M0,-5L10,0L0,5");
        // 创建 <g> 元素并添加链接（<path>）
        const link = gLink
          .attr("fill", "none")
          .attr("stroke-width", 1.5)
          .selectAll("path")
          .data(uniqueGraph)// 使用 data() 方法绑定数据
          .join("path")// 使用 join() 方法来创建 <path> 元素
          .attr("stroke", (d:any) => color(d.type))
          .attr("marker-end", (d:any) => `url(${new URL(`#arrow-${d.type}`, window.location.href)})`)
  
        // 创建 <g> 元素并添加节点（<circle> 和 <text>）
  
        const node = gNode
          .attr("fill", "currentColor")
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .selectAll("g")
          .data(uniqueNodeArray)
          .join("g")
          .call(drag(simulation) as any )
         
          // .on('mouseout', handleMouseOut) // 鼠标移开节点
    
        // 鼠标移入节点时的处理函数
        function handleMouseOver(event:any,d:any) {
          var hoveredNode = d; // 获取当前鼠标悬停的节点数据
          console.log("当前悬停的节点：", hoveredNode);
          // 设置节点的透明度
          node.style('opacity', (d:any) => {
            if(d.id===hoveredNode.id) return 1;
            const opacityValue = uniqueGraph.some((item) => {
              return item.source.id === hoveredNode.id && item.target.id === d.id;
            }) ? 1 : 0.1;
            return opacityValue;
           
          });
          // 设置连接线的透明度
          link.style('opacity', (link:any) => link.source === d  ? 1 : 0.1);
        }
        // 移出节点时的处理函数
        function handleMouseOut(event:any,d:any) {
          var hoveredNode = d; // 获取当前鼠标悬停的节点数据
          console.log("当前悬停的节点：", hoveredNode);
          // 设置节点的透明度
          node.style('opacity', 1);
          // 设置连接线的透明度
          link.style('opacity', 1);
        }
        const circle = node.append("circle")
          .attr("stroke", "white")
          .attr("stroke-width", nominal_stroke) //设置 SVG 元素的描边宽度的属性
          // .attr("r", d => d.weight * 40) //按照比重设置大小
          .attr("r", 15)
        .attr("fill", (d:any) => color(d.type))
        .on('mouseover', handleMouseOver)
        .on('click', handleMouseOut) // 点击节点
  
        const text = node.append("text")
          .attr("x", 8)
          .attr("y", "1.5em")
          .attr('text-anchor', 'middle')
          .text((d:any) => d.id)
          .clone(true).lower()
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 3);
  
        // 节点拖动时，路径重新指向
        function linkArc(d:any) {
          const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
          return `
              M${d.source.x},${d.source.y}
              A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
            `;
        }
  
        // 定义缩放函数的回调
        function zoomed(event:any) {
          // 获取缩放和平移的变换
          const transform = event.transform;
          link.attr('transform', transform);
          node_.attr('transform', transform)
  
        }
        // 拖动事件
        function drag(simulation:any) {
          function dragstarted(event:any,d:any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          }
  
          function dragged(event:any,d:any) {
            d.fx = event.x;
            d.fy = event.y;
          }
  
          function dragended(event:any,d:any) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }
  
          return d3.drag()
            .on("start", (d3:any, d:any) => dragstarted(d3, d))
            .on("drag", (d3:any, d:any) => dragged(d3, d))
            .on("end", (d3:any, d:any) => dragended(d3, d));
  
  
        }
  
        simulation.on("tick", () => {
  
          link.attr("d", linkArc);
          node.attr("transform",(d:any) => `translate(${d.x},${d.y})`);
        });
        return () => {simulation.stop();}
        // 设置 shouldRender 为 false，防止重复渲染
  
    }, [data]);
    return (
      <svg ref={svgRef} >
      </svg>
  )
}
export default LinePlot;