<template>
	<view>
		<view class="head bg-gradual-blue padding text-center"><!-- 头像，昵称 -->
			<view style="float: left;margin-top: 30rpx;">
				<!-- <open-data class="avatar_image" type="userAvatarUrl"></open-data> -->
				<image class="cu-avatar xl round margin-left" :src="user_info.avatar"></image>
			</view>
			<view class="nick_name" style="float: left;width: 400rpx;text-align: left;margin-left: 20rpx;">
				<!-- <open-data type="userNickName"></open-data> -->
				<text>{{user_info.name}}</text>
				<hr>
				<text style="line-height: 1.5;">{{buildingInfo.buName}}-{{buildingInfo.buHome}}</text>
				<hr>
				<text>{{carPosition.carAddr}}</text>
			</view>
		</view>

		<!-- List -->
		<view class="cu-list menu" style="margin-top: 50rpx;">
			<view class="cu-item">
				<view @click="toRepairSpeed()" class="content">
					<text class="cuIcon-repair text-grey green" style="color: #1cbbb4;"></text>
					<text class="text-grey">维修进度</text>
				</view>
			</view>
			<view class="cu-item">
				<view @click="toPayrecord()" class="content">
					<text class="cuIcon-recharge text-grey green" style="color: #1cbbb4;"></text>
					<text class="text-grey">缴费记录</text>
				</view>
			</view>
			<view class="cu-item">
				<view @click="toSuggestionSpeed()" class="content">
					<text class="cuIcon-warn text-grey blue" style="color: #1cbbb4;"></text>
					<text class="text-grey">我的投诉建议</text>
				</view>
			</view>
			
			<view class="cu-item" style="margin-top: 20rpx;">
				<view @click="editUserInfo()" class="content">
					<text class="cuIcon-people text-grey green" style="color: #1cbbb4;"></text>
					<text class="text-grey">修改个人信息</text>
				</view>
			</view>
			<view class="cu-item">
				<view @click="editPassword()" class="content">
					<text class="cuIcon-lock text-grey green" style="color: #1cbbb4;"></text>
					<text class="text-grey">重置密码</text>
				</view>
			</view>
			<view class="cu-item">
				<button class="cu-btn content" open-type="contact">
					<text class="cuIcon-community text-grey" style="color: #8dc63f;"></text>
					<text class="text-grey">意见反馈</text>
				</button>
			</view>
			<view style="margin-top: 20rpx;" class="cu-item">
				<view @click="aboutUs()" class="content">
					<image src="/static/img/logo.png" class="png" mode="aspectFit"></image>
					<text class="text-grey">关于我们</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import BASE_HOST from '../../../util/util.js'
	export default {
		data() {
			return {
				user_info: {},
				buildingInfo: {},
				carPosition: {}
			}
		},
		onShow() {
			this.getUserInfo()
			this.getBuildingInfo()
			this.getCarPostionInfo()
		},
		methods: {
			toPayrecord() {
				uni.navigateTo({
					url:'../../pay/payrecord'
				})
			},
			editUserInfo() {
				uni.navigateTo({
					url:'../editUserInfo/editUserInfo'
				})
			},
			getCarPostionInfo() {
				var _this = this
				uni.request({
					url:BASE_HOST + 'car/getByUserId',
					method:'GET',
					data:{
						user_id: uni.getStorageSync('local_userinfo').token
					},
					success(res) {
						if (res.data.data === null) {
							_this.carPosition.carAddr = '无'
						} else {
							_this.carPosition = res.data.data
						}
						
					}
				})
			},
			getBuildingInfo() {
				var _this = this
				uni.request({
					url:BASE_HOST + 'building/getById',
					method:'GET',
					data:{
						id: uni.getStorageSync('local_userinfo').token
					},
					success(res) {
						if (res.data.data === null) {
							_this.buildingInfo.buName = '无'
							_this.buildingInfo.buHome = '无'
						}
						_this.buildingInfo = res.data.data
					}
				})
			},
			getUserInfo() {
				this.user_info = uni.getStorageSync('local_userinfo')
				if(this.user_info.avatar.substr(0,5) !== 'https') {
					this.user_info.avatar = BASE_HOST + this.user_info.avatar
				}
			},
			toSuggestionSpeed() {
				uni.navigateTo({
					url:'../../suggestion/suggestion_speed'
				})
			},
			toRepairSpeed() {
				uni.navigateTo({
					url:'../../repair/repair_speed'
				})
			},
			isLogin(){
				if (!uni.getStorageSync('local_userinfo')) {
					uni.showToast({
						title: '请登录哦!',
						duration: 2000
					});
					uni.navigateTo({
						url: '../../base/login/login'
					})
				}
			},
			aboutUs() {
				uni.showModal({
				    title: '关于我们',
				    content: '用心做好小区的管理工作',
				    success: function (res) {
				    }
				});
			},
			editPassword() {
				uni.navigateTo({
					url:'../editPassword/editPassword'
				})
			}
		}
	}
</script>

<style>
.head{
	width: 100%;
	height: 300rpx;
	z-index: 2;
}
.avatar_image{
		width: 120rpx;
		height: 120rpx;
		display:block;
		overflow:hidden;
		border-radius: 50%;
		margin-left: 20rpx;
		margin-top: 20rpx;
	}
.nick_name{
		font-size: 20;
		margin-left: 30rpx;
		margin-top: 65rpx;
}
.head_down_list{
	width: 95%;
	height: 150rpx;
	background-color: #fff;
	margin: 0 auto;
	border-radius: 30rpx;
	margin-top: -70rpx;
	z-index: 3;
	text-align: center;
}
</style>
