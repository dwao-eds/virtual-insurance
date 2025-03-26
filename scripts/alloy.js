// Alloy namespace initialization
!function(n,o){o.forEach(function(o){n[o]||((n.__alloyNS=n.__alloyNS||
[]).push(o),n[o]=function(){var u=arguments;return new Promise(
function(i,l){n[o].q.push([i,l,u])})},n[o].q=[])})}
(window,["alloy"]);

// Dynamically load the Alloy script
var script = document.createElement('script');
script.src = "https://cdn1.adoberesources.net/alloy/2.19.1/alloy.min.js";
script.async = true;
document.head.appendChild(script);