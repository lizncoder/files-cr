#!/usr/bin/env node
const { program } = require("commander");
const fs = require("fs-extra");
const { join } = require("path");
const ora = require("ora");
const chalk = require("chalk");
const inquirer = require("inquirer");

program.name("ff").usage("<command> [option]");

program.version(
  `v${require("../package.json").version}`,
  "-v,--version",
  "display ff current version"
);

program.option("-h,--help", "display commanders");

//创建文件
program
  .command("mk <name> [destination]")
  .description("create a directory")
  .action(async (name, destination) => {
    const targetPath = process.cwd();
    const type = name.includes(".") ? "file" : "dir";
    //创建文件
    const mkdirFile = async (overwrite = false) => {
      const spinner = ora(`正在创建${name}文件`).start();
      spinner.spinner = {
        interval: 1000,
        frames: ["🏗️", "🧱", "🏥"],
      };
      if (overwrite) {
        await fs.remove(join(targetPath, destination ?? "", name));
      }
      fs.ensureFile(join(targetPath, destination ?? "", name), (err) => {
        if (err) {
          return spinner.fail(chalk.red(`创建${name}文件失败`));
        }

        spinner.succeed(chalk.green(`创建${name}文件成功`));
        // file has now been created, including the directory it is to be placed in
      });
    };

    //创建文件夹
    const mkdirDir = async (overwrite = false) => {
      const spinner = ora(`正在创建${name}文件`).start();

      spinner.spinner = {
        interval: 1000,
        frames: ["📁"],
      };
      if (overwrite) {
        await fs.remove(join(targetPath, destination ?? "", name));
      }

      fs.ensureDir(join(targetPath, destination ?? "", name), (err) => {
        if (err) {
          return spinner.fail(chalk.red(`创建${name}文件夹失败`));
        }

        spinner.succeed(chalk.green(`创建${name}文件夹成功`));
        // file has now been created, including the directory it is to be placed in
      });
    };

    const dirOrFile = (overwrite = false) => {
      switch (type) {
        case "dir":
          return mkdirDir(overwrite);
        case "file":
          return mkdirFile(overwrite);
      }
    };

    //判断当前文件是否存在
    const fileIsExists = await fs.pathExists(
      join(targetPath, destination ?? "", name)
    );
    if (fileIsExists) {
      const isOverwrite = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: `${name}文件已存在，是否覆盖？`,
          default: false,
        },
      ]);
      if (!isOverwrite["overwrite"]) {
        return;
      } else {
        dirOrFile(isOverwrite);

        return;
      }
    } else {
      dirOrFile();
    }
  });

//删除文件
program
  .command("rm <name> [destination]")
  .description("delete a file")
  .action(async (name, destination) => {
    const spinner = ora(`正在删除${name}文件`).start();
    spinner.spinner = {
      interval: 10000,
      frames: ["🚧", "🚛", "🚜"],
    };

    const targetPath = process.cwd();

    //判断当前文件是否存在
    const fileIsExists = await fs.pathExists(
      join(targetPath, destination ?? "", name)
    );

    if (!fileIsExists) return spinner.fail(`删除${name}文件失败,不存在该文件`);

    //删除文件
    fs.remove(join(targetPath, destination ?? "", name), (err) => {
      if (err) {
        return spinner.fail(`删除${name}文件失败`);
      }
      spinner.succeed(`删除${name}文件成功`);
    });
  });

//创建模板文件
program
  .command("create-temp <temp-name> [destination]")
  .description("create template")
  .action(async (name, rename) => {
    const targetPath = process.cwd();
    const tempName = rename ?? name;
    fs.copy(
      join(targetPath, name),
      join(__dirname, `../template/${tempName}`),
      (err) => {
        const spinner = ora(`📦正在创建${tempName}模板`).start();
        if (err) return spinner.fail(`📦创建${tempName}模板失败`);
        spinner.succeed(`📦创建${tempName}模板成功`);
      }
    );
  });
//删除模板文件
program
  .command("delete-temp <temp-name> [destination]")
  .description("delete template")
  .action(async (name, destination) => {
    const targetPath = join(__dirname, `../template/${name}`);
    const tempIsExists = await fs.pathExists(targetPath);
    const delTemp = await inquirer.prompt([
      {
        type: "confirm",
        name: "deltemp",
        message: `是否删除${name}模板`,
        default: false,
      },
    ]);
    if (!delTemp["deltemp"]) {
      return;
    }
    if (!tempIsExists) {
      return console.log(chalk.red("🆑 当前模板文件不存在，删除失败"));
    } else {
      const spinner = ora(`正在删除${name}模板`).start();
      spinner.color = "red";
      spinner.spinner = {
        interval: 80,
        frames: ["🙈"],
      };
      fs.remove(targetPath, (err) => {
        if (err) return spinner.fail(`删除${name}模板失败`);
        return spinner.succeed(`删除${name}成功`);
      });
    }
  });

//使用模板
program
  .command("ut <temp-name> [destination]")
  .description("use template")
  .action(async (name, destination) => {
    const targetPath = join(__dirname, `../template/${name}`);
    const destPath = join(process.cwd(), destination || name);
    const hasExist = fs.pathExistsSync(targetPath);

    if (!hasExist)
      return console.log(chalk.red("🆑 当前模板文件不存在，请先创建模板"));
    const spinner = ora(`正在复制${name}模板`).start();
    spinner.color = "green";
    spinner.spinner = {
      interval: 80,
      frames: ["✂︎"],
    };
    fs.copy(targetPath, destPath, (err) => {
      if (err) return spinner.fail(`复制${name}模板失败`);
      return spinner.succeed(`复制${name}模板成功`);
    });
  });
program.parse();
