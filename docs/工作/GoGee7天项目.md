# Go即时通信系统





## 基础Server端

完成一个基本的socket套接字连接

Server端实现



```go
package main

import (
	"fmt"
	"net"
)

type Server struct {
	Ip   string
	Port int
}

func NewServer(ip string, port int) *Server {
	server := &Server{ // 结构体名首字母大写
		Ip:   ip,
		Port: port,
	}
	return server
}

func (this *Server) Handler(conn net.Conn) {
	fmt.Println("connection successful!")
}

func (this *Server) Start() {
	listener, err := net.Listen("tcp", fmt.Sprintf("%s:%d", this.Ip, this.Port))
	if err != nil {
		fmt.Println("net Listen err:", err)
		return
	}
	defer listener.Close()

	for {
		conn, err := listener.Accept()
		if err != nil { // 修正拼写错误
			fmt.Println("Listener accept err:", err)
			continue
		}

		go this.Handler(conn)
	}
}
```



```go
package main

func main(){
	Server := NewServer("127.0.0.1",3456)
	Server.Start()
}
```



## 用户上线及广播功能

user.go

```go
package main

import(
	"net"
)

type User struct{
	Name string
	Addr string
	C chan string
	conn net.Conn
}

func NewUser(conn net.Conn) *User{
	userAddr := conn.RemoteAddr().String()

	user := &User{
		Name : userAddr,
		Addr : userAddr,
		C : make(chan string),
		conn : conn,
	}
	go user.ListenMessage()
	return user
}

func (this *User) ListenMessage(){
	for {
		msg := <- this.C

		this.conn.Write([]byte(msg+"\n"))
	}
}
```



server.go

```go
package main

import (
	"fmt"
	"net"
	"sync"
)

type Server struct {
	Ip   string
	Port int

	OnlineMap map[string]*User
	mapLock sync.RWMutex

	Message chan string
}

func NewServer(ip string, port int) *Server {
	server := &Server{ // 结构体名首字母大写
		Ip:   ip,
		Port: port,
		OnlineMap: make(map[string]*User),
		Message: make(chan string),
	}
	return server
}

func (this *Server) ListenMessager(){
	for {
		msg := <-this.Message

		this.mapLock.Lock()
		for _,cli := range this.OnlineMap{
			cli.C <- msg
		}
		this.mapLock.Unlock()
	}
}

func (this *Server) BroadCast(user *User,msg string){
	sendMsg := "[" + user.Addr + "]" + user.Name + ":" + msg

	this.Message <- sendMsg
}

func (this *Server) Handler(conn net.Conn) {
	fmt.Println("connection successful!")
	
	user := NewUser(conn) 

	this.mapLock.Lock()
	this.OnlineMap[user.Name] = user
	this.mapLock.Unlock()

	this.BroadCast(user,"already success")

	select {}

}

func (this *Server) Start() {
	listener, err := net.Listen("tcp", fmt.Sprintf("%s:%d", this.Ip, this.Port))
	if err != nil {
		fmt.Println("net Listen err:", err)
		return
	}
	defer listener.Close()

	go	this.ListenMessager() 

	for {
		conn, err := listener.Accept()
		if err != nil {
			fmt.Println("Listener accept err:", err)
			continue
		}

		go this.Handler(conn)
	}
}
```





## 用户消息广播功能



## 用户业务封装



## 在线用户查询



## 修改用户名



## 超时强踢功能



## 私聊功能







