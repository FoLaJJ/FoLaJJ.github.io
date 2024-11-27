# vulhub

项目地址： https://github.com/vulhub/vulhub/blob/master/README.zh-cn.md



```
# 安装pip
curl -s https://bootstrap.pypa.io/get-pip.py | python3
一般来说，新版ubuntu已经安装了

# 安装最新版docker
curl -s https://get.docker.com/ | sh

# 启动docker服务
systemctl start docker
```



```
# 下载项目
wget https://github.com/vulhub/vulhub/archive/master.zip -O vulhub-master.zip
unzip vulhub-master.zip
cd vulhub-master

# 进入某一个漏洞/环境的目录
cd flask/ssti

# 自动化编译环境
docker compose build

# 启动整个环境
docker compose up -d
```

