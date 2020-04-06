<template>
	<view>
		<view class="content">
			<image class="logo" src="/static/img/logo.png"></image>
			<view class="text-area">
				<text class="title">豫情豫景</text>
			</view>
		</view>
		<view style="margin-top: 100rpx;">
			<form>
				<view class="cu-form-group margin-top">
					<view class="title">账户</view>
					<input disabled="true" placeholder="请输入手机号" type="number" name="input" v-model="local_myinfo.phone"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">密码</view>
					<input password placeholder="请输入密码" name="input" v-model="password"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">密码</view>
					<input password placeholder="请再次输入密码" name="input" v-model="verify_password"></input>
				</view>
			</form>
			<div>
				<view class="padding-xl">
					<button @click="save()" class="cu-btn block bg-blue margin-tb-sm lg">
						<text class="cuIcon-pullright"></text> <text style="margin-left: 8rpx;">修改</text>
					</button>
					<button @click="reback()" class="cu-btn block bg-grey margin-tb-sm lg">
						<text class="cuIcon-pullleft"></text> <text style="margin-left: 8rpx;">取消</text>
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
				title: 'Hello',
				local_myinfo: {},
				password: '',
				verify_password: ''
			}
		},
		onShow() {
			this.initMyInfo()
		},
		onLoad() {
			
		},
		methods: {
			initMyInfo() {
				this.local_myinfo = uni.getStorageSync('local_userinfo')
			},
			save() {
				var _this = this
				if(this.password.length < 6) {
					uni.showToast({
						title: '密码太短了',
						duration: 2000,
						icon: 'none'
					});
					return
				}
				
				if(this.password === this.verify_password) {
					 uni.request({
					 	url: BASE_HOST + 'user/resetPwd',
						method:'POST',
						data:{
							'id': _this.local_myinfo.token,
							'userPassword': _this.$md5(_this.password)
						},
						success(res) {
							if(res.data.code !== 20000) {
								uni.showToast({
									title: res.data.msg,
									duration: 2000,
									icon: 'none'
								});
							} else {
								uni.setStorage({
								    key: 'local_userinfo',
								    data: ''
								});
								uni.switchTab({
									url: '../login/login'
								})
							}
						}
					 })
				} else {
					uni.showToast({
						title: '密码不一致',
						duration: 2000,
						icon: 'none'
					});
				}
			
			},
			reback() {
				uni.switchTab({
					url: '../me/me'
				})
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
		height: 200rpx;
		width: 180rpx;
		margin-top: 150rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
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
