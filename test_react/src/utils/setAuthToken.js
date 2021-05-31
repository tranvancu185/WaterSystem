//dinh token vao du lieu


import axios from 'axios'


const setAuthToken = token => {
	if (token) {// neu co token
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}` ///set header cho du lieu truyen di
	} else {//neu thu vien khong co access token
		delete axios.defaults.headers.common['Authorization'] /// xoa access token truoc do
	}
}

export default setAuthToken
