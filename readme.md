# ff

>这个工具是一个命令行工具，用于在文件系统中进行文件和文件夹的创建、删除和使用模板文件。它基于Node.js开发。

## What

- 创建文件或文件夹：使用mk命令可以创建指定名称的文件或文件夹，并可以选择指定目标位置。
- 删除文件或文件夹：使用rm命令可以删除指定名称的文件或文件夹。
- 创建模板文件：使用create-temp命令可以将指定名称的文件复制为模板文件，用于后续使用。
- 删除模板文件：使用delete-temp命令可以删除指定名称的模板文件。
- 使用模板：使用ut命令可以使用指定名称的模板文件创建新的文件或文件夹。

## Installation
```shell
npm i files-cr -g
```

## Usage

```
Usage: ff <command> [option]

Options:
  -v,--version                           display ff current version
  -h,--help                              display commanders

Commands:
  mk <name> [destination]                create a directory
  rm <name> [destination]                delete a file
  create-temp <temp-name> [destination]  create template
  delete-temp <temp-name> [destination]  delete template
  ut <temp-name> [destination]           use template
```
```
### mk

- Run `ff mk demo `
- Create a directory named `demo` in the current directory
- Run `ff mk demo /tmp`
- Create a directory named `demo` in the `/tmp` directory
- Run `ff mk demo.js `
- Create a file named `demo.js` in the current directory
- Run `ff mk demo.js /tmp`
- Create a file named `demo.js` in the `/tmp` directory

### rm
- Run `ff rm demo `
- Delete the file named `demo` in the current directory
- Run `ff rm demo /tmp`
- Delete the file named `demo` in the `/tmp` directory

### create-temp
- Run `ff create-temp demo `
- Create a template named `demo` in the current directory
- Run `ff create-temp demo /tmp`
- Create a template named `demo` in the `/tmp` directory

### delete-temp
- Run `ff delete-temp demo `
- Delete the template named `demo` in the current directory

### ut
- Run `ff ut demo `
- Use the template named `demo` in the current directory

```
## LICENSE
MIT