<template>
	<view>
		<view v-for="(item, index) in mySuggstionList" :key="index">
			<view class="bg-white padding margin-top-xs">
				<view class="action" style="line-height: 2;">
					<text class="cuIcon-title text-green"></text>
					<text class="text-olive" style="padding-right: 8rpx;">[{{item.createDate | dateFormat}}]</text>
					<text>{{item.suText}}</text>
				</view>
				<view class="cu-steps">
					<view class="cu-item" :class="ind>item.suStatus-1?'':'text-blue'" v-for="(ico_item,ind) in basicsList" :key="ind">
						<text :class="ind>item.suStatus-1?'cuIcon-title':'cuIcon-' + ico_item.cuIcon"></text> {{ico_item.name}}
					</view>
					<view @click="toEvaluate(item)" style="line-height: 100rpx;" v-if="item.suStatus===3 && item.suEvaluate === -1">
						<text class="cuIcon-comment text-blue">{{item.suStatus}}</text>
					</view>
				</view>
				
				<!-- 评价对话框 Start-->
				<view class="cu-modal" :class="showModel">
					<view class="cu-dialog">
						<view class="cu-bar bg-white justify-end">
							<view class="content">评价</view>
							<view class="action" @tap="hideModal">
								<text class="cuIcon-close text-red"></text>
							</view>
						</view>
						<view style="margin-left: 35rpx;line-height: 2;margin-bottom: 20rpx;">
							<uni-rate @change="rateChange()" :value="evaluateInfo.repairEvaluate" size="18"></uni-rate>
						</view>
						<view style="text-align: left;height: 150rpx;padding-left: 35rpx;">
							评价:<textarea style="height: 150rpx;" maxlength="300" v-model="evaluateInfo.repairEvaluateText"></textarea>
						</view>
						<view class="cu-bar bg-white justify-end">
							<view class="action">
								<button class="cu-btn line-blue text-blue" @tap="hideModal">取消</button>
								<button class="cu-btn bg-blue margin-left" @tap="enshureEvaluate">确定</button>
							</view>
						</view>
					</view>
				</view>
				<!-- 评价对话框 End-->
				<view style="line-height: 100rpx;" v-if="item.suStatus===3 && item.suEvaluate !== -1">
					<text style="color: #FF7F24;">评价：</text><text style="color: #888888">{{item.suEvaluateText}}</text>
					<uni-rate :value="item.suEvaluate" size="16"></uni-rate>
				</view>
			</view>
		</view>
		<view style="height: 200rpx;"></view>
		</view>
	</view>
</template>

<script>
	import uniRate from '@/components/uni-rate/uni-rate.vue'
	import BASE_HOST from '../../util/util.js'
	export default {
		components: {uniRate},
		data() {
			return {
				basicsList: [{
					cuIcon: 'usefullfill',
					name: '建议/投诉'
				}, {
					cuIcon: 'radioboxfill',
					name: '已查看'
				}, {
					cuIcon: 'roundcheckfill',
					name: '已处理'
				}],
				mySuggstionList: [],
				showModel: '',
				currentEvaluateId: 0,
				evaluateInfo: {
				  repairEvaluate: -1,
				  repairEvaluateText: ''
				}
			}
		},
		filters: {
			dateFormat(value) {
				var d = new Date(value)
				return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
			}
		},
		onShow() {
			this.getAll()
		},
		methods: {
			rateChange(value) {
				this.evaluateInfo.repairEvaluate = value.value
			},
			enshureEvaluate() {
				if (this.evaluateInfo.repairEvaluate === -1 || this.evaluateInfo.repairEvaluateText === '') {
					uni.showToast({
					    title: '请完善信息',
					    duration: 2000,
							icon:'none'
					});
					return
				}
				var _this = this
				uni.request({
					url: BASE_HOST + 'suggestion/addEvaluate',
					method: 'POST',
					data: {
									id: _this.currentEvaluateId,
									suEvaluate: _this.evaluateInfo.repairEvaluate,
									suEvaluateText: _this.evaluateInfo.repairEvaluateText
					},
					success: (res) => {
								uni.showToast({
										title: '评价成功',
										duration: 2000
								});
								_this.getAll()
								this.hideModal()
					}
					});
			},
			toEvaluate(item) {
				this.showModel = 'show'
				this.currentEvaluateId = item.id
			},
			hideModal() {
				this.showModel = ''
			},
			getAll() {
				var _this = this
				uni.request({
					url: BASE_HOST + 'suggestion/getAllOfMy',
					method: 'GET',
					header: {
						XiaoQuToken: uni.getStorageSync('local_userinfo').token,
					},
					success(res) {
						_this.mySuggstionList = res.data.data
					},
					fail(err) {
						console.log(err)
					}
				})
			}
		}
	}
</script>

<style>

</style>
