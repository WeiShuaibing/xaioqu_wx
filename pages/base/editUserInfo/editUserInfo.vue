<template>
	<view>
		<!-- <view class="content">
			<image class="logo" src="/static/img/logo.png"></image>
			<view class="text-area">
				<text class="title">豫情豫景</text>
			</view>
		</view> -->
		<view style="">
			<form>
				<!-- 头像 -->
				<view class="cu-form-group" style="padding-top: 20rpx;">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
							<image :src="imgList[index]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
								<text class='cuIcon-close'></text>
							</view>
						</view>
						<view class="solids" @tap="ChooseImage" v-if="imgList.length<1">
							<text class='cuIcon-cameraadd'></text>
						</view>
					</view>
				</view>
				<!-- 头像 End -->
				<view class="cu-form-group">
					<view class="title">账户</view>
					<input disabled="true" name="input" v-model="editUserInfo.userPhone"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">名字</view>
					<input name="input" v-model="editUserInfo.userName"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">性别</view>
					<picker @change="PickerChange" :value="sexIndex" :range="sex">
						<view class="picker">
							{{sexIndex>-1?sex[sexIndex]:editUserInfo.userSex}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">年龄</view>
					<picker @change="PickerAgeChange" :value="ageIndex" :range="ageList">
						<view class="picker">
							{{ageIndex>-1?ageList[ageIndex]:editUserInfo.userAge}}
						</view>
					</picker>
				</view>
			</form>
			<div>
				<view class="padding-xl">
					<button @click="save()" class="cu-btn block bg-blue margin-tb-sm lg">
						<text class="cuIcon-pullright"></text> <text style="margin-left: 8rpx;">修改</text>
					</button>
				</view>
			</div>
		</view>
	</view>
</template>

<script>
	import BASE_HOST from '../../../util/util.js'
	export default {
		data() {
			return {
				ageIndex: -1,
				ageList: [18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
				sexIndex: -1,
				sex: ['男','女'],
				imgList: [],
				upImgList: '',
				editUserInfo: {
					userPhone: '',
					userName: '',
					userSex: '',
					userAge: 0
				},
				local_myinfo: {}
			}
		},
		onShow() {
			this.initMyInfo()
		},
		methods: {
			save() {
				var _this = this
				if(this.imgList.length===0 || this.editUserInfo.userName==='') {
					uni.showToast({
						title: '请完善内容哦！',
						duration: 2000,
						icon: 'none'
					})
					return
				}
				
				uni.uploadFile({
					url: BASE_HOST + 'file/upload',
					filePath: _this.imgList[0],
					name: 'file',
					success: (res) => {
						var r = JSON.parse(res.data)
						_this.upImgList = r.data.path
					},
					fail(err) {
						uni.showToast({
							title: '上传失败！',
							duration: 2000,
							icon: 'none'
						})
					},
					complete() {
						uni.request({
							url:BASE_HOST + 'user/update',
							method:'POST',
							data:{
								id: _this.local_myinfo.token,
								userName: _this.editUserInfo.userName,
								userSex: _this.sex[_this.sexIndex],
								userAge: _this.ageList[_this.ageIndex],
								userAvatar: _this.upImgList
							},
							success(res) {
								if(res.data.code === 20000) {
									uni.request({
										url: BASE_HOST + 'user/infoForStore',
										method:'GET',
										header: {
											YQYJToken: uni.getStorageSync('local_userinfo').token,
										},
										success(res) {
											uni.switchTab({
												url: '../me/me'
											})
											uni.setStorage({
											    key: 'local_userinfo',
											    data: res.data.data
											});
										}
									})
								}
							}
						})
					}
				})
				
			},
			PickerAgeChange(e) {
				this.ageIndex = e.detail.value
			},
			PickerChange(e) {
				this.sexIndex = e.detail.value
			},
			initMyInfo() {
				this.local_myinfo = uni.getStorageSync('local_userinfo')
				this.editUserInfo.userPhone = this.local_myinfo.phone
				this.editUserInfo.userName = this.local_myinfo.name
				this.editUserInfo.userSex = this.local_myinfo.sex
				this.editUserInfo.userAge = this.local_myinfo.age
				if(this.local_myinfo.avatar.substr(0,5)==='https'){
					this.imgList.push(this.local_myinfo.avatar)
				} else {
					this.imgList.push(BASE_HOST + this.local_myinfo.avatar)
				}
			},
			ChooseImage() {
				uni.chooseImage({
					count: 4, //默认4
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						if (this.imgList.length != 0) {
							// this.imgList = this.imgList.concat(res.tempFilePaths)
							this.imgList = res.tempFilePaths
						} else {
							this.imgList = res.tempFilePaths
						}
					}
				});
			},
			DelImg(e) {
				this.imgList.splice(e.currentTarget.dataset.index, 1)
				// uni.showModal({
				// 	title: '亲',
				// 	content: '确定删除此图片吗？',
				// 	cancelText: '否',
				// 	confirmText: '是',
				// 	success: res => {
				// 		if (res.confirm) {
				// 			this.imgList.splice(e.currentTarget.dataset.index, 1)
				// 		}
				// 	}
				// })
			}
		}
	}
</script>

<style>
.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 160rpx;
		width: 150rpx;
		margin-top: 80rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 20rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
