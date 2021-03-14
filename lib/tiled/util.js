export function getXMLProperties(node) {
	let props = [];
	if(!node || !node.nodes || node.nodes.length == 0) return props;
	if(node.name == "properties") {
		for(const property of node.nodes) {
			props.push(property.attributes);
		}
		return props;
	}
	return getProperties(node.nodes.find(node => node.name == "properties"));
}
