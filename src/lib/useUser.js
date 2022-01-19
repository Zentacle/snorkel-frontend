import { rootDomain } from "src/lib/constants";
const useUser = () => {
  fetch(`${rootDomain}/user/me`, {
    method: 'GET',
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json'
    }
  }).then(response => {
      return response.json()
  }).then(data => {
      return data
  })
}

export default useUser;