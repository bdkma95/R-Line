async function runMethods(inputs, funct, stateMutability, _sender, contract){

    try {
        var result = null;
        if (inputs.length > 0) {
            const values = inputs.map(param => {
                return param.value;
            })
            if (stateMutability === "view") {
                result = await contract.methods[funct](...values).call()
            } else {
                result = await contract.methods[funct](...values).send({ from: _sender })
            }
        } else {
            result = await contract.methods[funct]().call()
        }
        return result;

    } catch (err) {
        console.warn(err)
        return 0
    }
}

module.exports = {
    runMethods:runMethods
};