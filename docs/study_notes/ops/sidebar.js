module.exports = [
		{
			title:'Linux',
			collapsable: true,
			children:[
				{
					title:'Linux 基础',
					collapsable: true,
					children:[
                        {
                            title:'阶段一：初识 Linux',
                            collapsable: true,
                            children:[
                                '/study_notes/ops/linux/basic/stage1/01',
                                '/study_notes/ops/linux/basic/stage1/02',
                                '/study_notes/ops/linux/basic/stage1/03',
                                '/study_notes/ops/linux/basic/stage1/04',
                                '/study_notes/ops/linux/basic/stage1/05',

                            ]
                        },
                        {
                            title:'阶段二：Linux 基础',
                            collapsable: true,
                            children:[
                                '/study_notes/ops/linux/basic/stage2/06Linux的由来',
                                '/study_notes/ops/linux/basic/stage2/07Linux文件管理基础',
                                '/study_notes/ops/linux/basic/stage2/08Linux文件权限管理',
                                '/study_notes/ops/linux/basic/stage2/09Linux特殊权限',
                                '/study_notes/ops/linux/basic/stage2/10Linux chattr',
                                '/study_notes/ops/linux/basic/stage2/11CentOS 软件包管理YUM',
                                '/study_notes/ops/linux/basic/stage2/12CentOS Linux 软件包管理 RPM ',
                                '/study_notes/ops/linux/basic/stage2/13CentOS Linux 源码安装 Nginx ',
                                '/study_notes/ops/linux/basic/stage2/14安装openresty',
                                '/study_notes/ops/linux/basic/stage2/15自定义YUM仓库',
                                '/study_notes/ops/linux/basic/stage2/16Linux 进程管理',
                                '/study_notes/ops/linux/basic/stage2/17进程管理 练习',
                                '/study_notes/ops/linux/basic/stage2/18Linux 提权sudo',
                                '/study_notes/ops/linux/basic/stage2/19Jumpserver堡垒机',
                                '/study_notes/ops/linux/basic/stage2/19管道及IO重定向',
                                '/study_notes/ops/linux/basic/stage2/20基础输入输出重定向练习题',
                                '/study_notes/ops/linux/basic/stage2/21CentOS Linux 文件查找',
                                '/study_notes/ops/linux/basic/stage2/21查找命令相关练习',
                                '/study_notes/ops/linux/basic/stage2/22CentOS Linux 计划任务',
                                '/study_notes/ops/linux/basic/stage2/23CentOS Linux 存储管理',

                            ]
                        },


					]
				},
				{
					title:'Linux 进阶',
					collapsable: true,
					children:[
						'/study_notes/ops/linux/high-level/01',

					]
				},

			]
		},
		{
			title:'Ansible',
			collapsable: true,
			children:[
				'/study_notes/ops/ansible/basic/01',
                '/study_notes/ops/ansible/basic/02',
                '/study_notes/ops/ansible/basic/03',
                
			]
		},
		{
			title:'Disk',
			collapsable: true,
			children:[
				'/study_notes/ops/disk/01',
                
			]
		},
		{
			title:'Nginx',
			collapsable: true,
			children:[
				'/study_notes/ops/nginx/01',
				'/study_notes/ops/nginx/02',
                
			]
		},
		{
			title:'Docker',
			collapsable: true,
			children:[
				'/study_notes/ops/docker/01',
                
			]
		},
	]