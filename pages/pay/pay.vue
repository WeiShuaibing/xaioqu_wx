<template>
	<view>
		<view v-if="isShowNoPay">
			<view class="bg-white flex-sub radius shadow-lg">
							<image src="https://image.weilanwl.com/gif/rhomb-white.gif" mode="aspectFit" class="gif-white response" style="height:240upx"></image>
			</view>
			<view style="width: 100%;text-align: center;line-height: 3;" class="text-gray text-sm">所有费用您都交过了</view>
		</view>
		<view class="cu-list menu" v-else>
			<view class="cu-item" v-for="(item, index) in shoudPayList" :key="index">
					<view class="content padding-tb-sm">
						<view>
							<text class="cuIcon-lightfill text-yellow margin-right-xs"></text> 
							<view class='cu-tag bg-cyan' v-if="item.payType===1">物业费</view>
							<view class='cu-tag bg-blue' v-if="item.payType===2">停车费</view>
							<view class='cu-tag bg-olive' v-if="item.payType===3">水费</view>
							<view class='cu-tag bg-red' v-if="item.payType===4">电费</view>
							<text style="margin-left:8rpx;">{{item.payText}}</text>
						</view>
						<view class="text-gray text-sm">
							<text class="cuIcon-timefill margin-right-xs"></text> 截止时间：{{item.payEnddate | dateFormat}}
							<br>
							<text class="cuIcon-title margin-right-xs"></text> 备注： {{item.payRemark}}
						</view>
					</view>
					<view class="action">
						<button class="cu-btn bg-yellow text-white" @click="toPay(item)">￥{{item.payMoney}}</button>
					</view>
			</view>
		</view>
	</view>
</template>

<script>
	import BASE_HOST from '../../util/util.js'
	export default {
		data() {
			return {
				shoudPayList: [],
				isShowNoPay: false
			}
		},
		filters: {
		    dateFormat(value) {
		      var d = new Date(value)
		      return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
		    }
		},
		mounted() {
			this.getAllOfINotPay()
		},
		methods: {
			toPay(item) {
				var _this = this
				uni.request({
					url: BASE_HOST + 'payrecord/setNewRecord',
					method:'GET',
					header:{
						XiaoQuToken: uni.getStorageSync('local_userinfo').token
					},
					data:{
						id: item.id
					},
					success(res) {
						uni.showToast({
						    title: '缴费成功',
						    duration: 2000
						});
						_this.getAllOfINotPay()
					}
				})
			},
			getAllOfINotPay() {
				var _this = this
				uni.request({
					url: BASE_HOST + 'payorder/getAllOfINotPay',
					method: 'GET',
					header:{
						XiaoQuToken: uni.getStorageSync('local_userinfo').token
					},
					success(res) {
						console.log(res.data.data)
						_this.shoudPayList = res.data.data
						if(_this.shoudPayList.length === 0) {
							_this.isShowNoPay = true
						}
					}
				})
			}
		}
	}
</script>

<style>

</style>
