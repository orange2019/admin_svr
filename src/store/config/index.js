import Request from './../../api/common/request'

class ConfigStore {

  async getConfig(state , configName){
    console.log('ConfigStore.getConfig configName' , configName)
    let ret = await Request.get('/api/config/value' , {name : configName})
    console.log('ConfigStore.getConfig ret' , ret)

    // state.config[configName] = ret.data ? (ret.data.info || null) : null
    if(ret.code == 0){
      state.config[configName] = ret.data.info
    }
  }

  async submitConfig(state, data){
    console.log('ConfigStore.submitConfig data' , data)
    let ret = await Request.post('/api/config/submit' , {
      name: data.name,
      value: state.config[data.name] || ''
    })
    console.log('ConfigStore.submitConfig ret' , ret)
    if(ret.code == 0){
      // state.config[configName] = ret.data.info
      await this.getConfig(state , data.name)
    }else {
      // state.config[configName] = null
    }
  }
}

export default new ConfigStore