// import Request from './common/request'

// const Domain = 'http://127.0.0.1:8888'

// const URLS = {
//   getCount: Domain + '/getCount',
//   getLists: Domain + '/postLists'
// }

export async function getCount(data){
  return {count : data.count + 1}
}

