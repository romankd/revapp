curl -v --header "Content-Type: application/json" \
  --request PUT \
  --data '{"dateOfBirth":"2017-06-02"}' \
  http://localhost:3000/hello/user1


curl -v --header "Content-Type: application/json" \
  --request GET \
  http://localhost:3000/hello/user1



curl -v --header "Content-Type: application/json" \
  --request PUT \
  --data '{"dateOfBirth":"2017-06-20"}' \
  http://localhost:3000/hello/user2


curl -v  --header "Content-Type: application/json" \
  --request GET \
  http://localhost:3000/hello/user2


curl -v --header "Content-Type: application/json" \
  --request PUT \
  --data '{"dateOfBirth":"2022-06-12"}' \
  http://localhost:3000/hello/user11

curl -v  --header "Content-Type: application/json" \
  --request GET \
  http://localhost:3000/hello/user11