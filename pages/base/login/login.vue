<template>
	<view>
		<view class="content">
			<image class="logo" src="/static/img/logo.png"></image>
			<view class="text-area">
				<text class="title">小区管理</text>
			</view>
		</view>
		<view style="margin-top: 100rpx;">
			<form>
				<view class="cu-form-group margin-top">
					<view class="title">账户</view>
					<input placeholder="请输入手机号" type="number" name="input" v-model="user_phone"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">密码</view>
					<input password placeholder="请输入密码" name="input" v-model="user_password"></input>
				</view>
			</form>
			<div>
				<view class="padding-xl">
					<button @click="login()" class="cu-btn block bg-blue margin-tb-sm lg">
						<!-- <text class="cuIcon-pullright"></text> -->
						<text style="margin-left: 8rpx;">登录</text>
					</button>
				</view>
			</div>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				user_phone: '12345678001',
				user_password: '123456'
			}
		},
		onLoad() {

		},
		methods: {
			login() {
				if(this.user_phone === '' || this.user_password === ''){
					uni.showToast({
					    title: '请完善信息',
					    duration: 2000,
							icon: 'none'
					});
				}
				uni.request({
				    url: this.$BASE_HOST+'user/login', //仅为示例，并非真实接口地址。
						method: 'POST',
				    data: {
				        userPhone: this.user_phone,
								userPassword: this.$md5(this.user_password)
				    },
				    success: (res) => {
				        console.log(res.data);
								if(res.data.code !== 20000){
									uni.showToast({
									    title: '账号或密码错误',
									    duration: 2000,
											icon: 'none'
									});
								} else {
									uni.switchTab({
									    url: '../../home/home'
									});
									uni.setStorage({
									    key: 'local_userinfo',
									    data: res.data.data
									});
								}
				    }
				});
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
