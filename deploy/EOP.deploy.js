// Just a standard hardhat-deploy deployment definition file!
const func = async (hre) => {


  const { deployments, getNamedAccounts } = hre

  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  //console.log(deployer);
  
  await deploy('EOP', {
    from: deployer,
    args: [],
    log: true
  })



}

func.tags = [ 'EOP' ]
module.exports = func
