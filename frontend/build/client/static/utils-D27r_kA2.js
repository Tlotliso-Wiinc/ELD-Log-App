const n=new Intl.DateTimeFormat("sv-SE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:!1}),r=t=>t?n.format(new Date(t)):"",i=()=>{let t=window.location.protocol,o=window.location.hostname,e=window.location.port;return o==="localhost"||o==="127.0.0.1"||o===""?t+"//"+o+":8000":t+"//"+o+":"+e};export{r as f,i as g};
