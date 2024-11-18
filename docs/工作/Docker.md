# Docker



## 由来

之前的部署方式：

直接将程序部署在服务器上，然后使用systemd类的守护类程序把多个业务程序部署并管理起来，但是没有管理业务程序的依赖

不增加部署的复杂性



## 技术栈

docker就是将程序和依赖一起部署上去，也称为轻量级虚拟机，操作系统虚拟化

他解决虚拟机的几大问题



CLI/UI



镜像过大问题

联合文件系统（UnionFS/UFS）



解决启停问题

namespace

Cgroups



解决性能损耗问题

共用内核





## 重要概念

### volume/数据卷

数据卷，可以把它当成在本地主机和不同容器中共享的文件夹





### Dockerfile

自动化脚本，创建镜像



### Image/镜像

类似虚拟机的快照

通过镜像实例化，我们可以创建多个容器



### Container/容器













## docker命令

卸载旧的：

```
docker compose stop
docker compose rm
```



装新的：

```
docker compose up -d
```



查看容器，列举所有的容器

```
docker ps
```



重启容器

```
docker restart <ID>
```



删除容器

```
docker rm <ID>
```



停止容器：

```
dicker stop <ID>
```



启动一个远程shell：

```
docker exec -it <ID> /bin/bash
```



创建镜像

```
docker build -t my-first-docker .

指定容器标签为my-first-docker， 最后一个.表示在当前目录下寻找dockerfile
```



启动容器

```
docker run -p 80:5000 -d my-first-docker
-p 将容器上的80端口映射到本地主机的5000端口，并且运行容器
-d 表示daemon，就是守护进程
```



创建数据卷：

```
docker volume create my-first-docker-data
```

随后启动容器的时候可以指定数据卷进行创建，指定数据卷挂在docker

```
docker run -dp 80:5000 my-first-docker -v my-first-docker-data:/etc/finance my-first-docker
```



## dockerfile



基础镜像：

```
FROM python:3.8-slim-buster
```



工作路径

```
WORKDIR /app
```



```
COPY <本地路径 > <目标路径>
```



将所有的程序拷贝到Docker镜像：

```
COPY . .
```



允许创建镜像的时候运行任意的shell：

```
RUN
```

如：

```
RUN pip3 install -r requirements.txt
```



CMD指定当Docker容器运行起来以后要执行的命令：

```
CMD ["python3","app.py"]
```



综上一个简单的Dockerfile脚本如下：

```dockerfile
FROM python:3.8-slim-buster
WORKDIR /app
COPY . .
RUN pip3 install -r requirements.txt
CMD ["python3","app.py"]
```





### docker-compose.yml

`services` 定义多个容器



```docker
version:"3"

services:
	web:
		build:
		ports:
			- "80:5000"
	db:
		image: "mysql"
		environment:
			MYSQL_DATABASE: my-first-docker-db
			MYSQL_ROOT_PASSWORD: secret
		volumes:
			- my-first-docker-data:/var/lib/mysql

volumes:
	my-first-docker-data:
```



运行所有容器

```
docker compose up -d
```

删除所有容器

```
docker compose down
```

删除所有容器的同时删除数据卷

```
docker compose down --volumes
```













## Docker和Kubernetes