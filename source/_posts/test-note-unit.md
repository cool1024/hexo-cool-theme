---
title: PHP单元测试
date: 2018-12-12 18:37:40
tags: unit
categories: php
---

## 说明
单元测试（unit testing），是指对软件中的最小可测试单元进行检查和验证。对于单元测试中单元的含义，一般来说，要根据实际情况去判定其具体含义，如C语言中单元指一个函数，Java里单元指一个类，图形化的软件中可以指一个窗口或一个菜单等。总的来说，单元就是人为规定的最小的被测功能模块。单元测试是在软件开发过程中要进行的最低级别的测试活动，软件的独立单元将在与程序的其他部分相隔离的情况下进行测试。

单元测试（模块测试）是开发者编写的一小段代码，用于检验被测代码的一个很小的、很明确的功能是否正确。通常而言，一个单元测试是用于判断某个特定条件（或者场景）下某个特定函数的行为。例如，你可能把一个很大的值放入一个有序list 中去，然后确认该值出现在list 的尾部。或者，你可能会从字符串中删除匹配某种模式的字符，然后确认字符串确实不再包含这些字符了。


## PHP Unit
1. 官方网站 https://phpunit.readthedocs.io/zh_CN/latest/database.html

2. 测试文件上传
```php
<?php
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Faker\Factory;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
class ToolTest extends TestCase
{
    /**
     * 测试文件上传
     *
     * @return array
     */
    public function testUpload()
    {
        $this->call('POST', 'webblog/tools-ui/upload', [], [], ['file' => UploadedFile::fake()->image(md5(time()) . '.jpg')]);
        $this->createHtml(__FUNCTION__);
        $this->assertResponseOk();
        $apiData = json_decode($this->response->getContent(), true);
        $this->log('info', __class__ . '::' . __FUNCTION__, $apiData);
        $this->assertEquals($apiData['result'], true);
        return $apiData['datas'];
    }
}
```

3. 
```php
<?php
use Laravel\Lumen\Testing\DatabaseMigrations;
use Laravel\Lumen\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Facade;
class ArticleTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * 测试添加文章标签接口
     *
     * @return array
     */
    public function testAddArticleLabel()
    {
        // 获取一个虚假的标签参数
        $params = [
            'article_label_name' => $this->faker->name,
        ];
        // 模拟测试路由
        $this->post('/webblog/article/label/add', $params);
        // 断言，请求200正常
        $this->assertResponseOk();
        // 获取响应数据，并解析成数组
        $response = json_decode($this->response->getContent(), true);
        // 断言，接口返回的result参数是true
        $this->assertEquals($response['result'], true);
        return $resopnse;
    }
    
    /**
     * 测试添加文章标签删除接口
     *
     * @return void
     */
    public function testdeleteArticleLabel()
    {
        // 使用上面的添加测试方法，添加一个标签
        $article_label = $this->testAddArticleLabel();
        Facade::clearResolvedInstances();
        // 模拟测试删除路由，附带上之前添加的lable id
        $response = $this->delete('/webblog/article/label/delete?id=' . $article_label['id']);
        $this->assertResponseOk();
        $response = json_decode($this->response->getContent(), true);
        $this->assertEquals($response['result'], true);
    }

    /**
     * 测试文章标签列表获取接口
     *
     * @return void
     */
    public function testArticleLabels()
    {
        $this->get('/webblog/article/label/list');
        $this->assertResponseOk();
        $response = json_decode($this->response->getContent(), true);
        $this->assertEquals($response['result'], true);
    }
}
```

## 持续集成（CONTINUOUS INTEGRATION）

在持续集成环境中，开发人员将会频繁的提交代码到主干。这些新提交在最终合并到主线之前，都需要通过编译和自动化测试流进行验证。这样做是基于之前

持续集成过程中很重视自动化测试验证结果，以保障所有的提交在合并主线之后的质量问题，对可能出现的一些问题进行预警。