<template>
    <el-card
        shadow="never"
        class="aui-card--fill">
        <img
            :src="getResourceURL()"
            class="image">
        <div class="mod-sys__dict">
            <el-table
                v-loading="dataListLoading"
                :data="dataList"
                border
                style="width: 100%;"
                @selection-change="dataListSelectionChangeHandle"
                @sort-change="dataListSortChangeHandle">
                <el-table-column
                    :label="$t('leave.activityName')"
                    prop="activityName"
                    header-align="center"
                    align="center"/>
                <el-table-column
                    :label="$t('leave.assignee')"
                    prop="assignee"
                    header-align="center"
                    align="center"/>
                <el-table-column
                    :label="$t('leave.startTime')"
                    prop="startTime"
                    header-align="center"
                    align="center"/>
                <el-table-column
                    :label="$t('leave.endTime')"
                    prop="endTime"
                    header-align="center"
                    align="center"/>
                <el-table-column
                    :label="$t('leave.comment')"
                    prop="comment"
                    header-align="center"
                    align="center"/>
                <el-table-column
                    :label="$t('leave.durationInSeconds')"
                    prop="durationInSeconds"
                    header-align="center"
                    align="center"
                    width="180"/>
            </el-table>
            <el-pagination
                v-if="dataForm.pid === '0'"
                :current-page="page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="pageSizeChangeHandle"
                @current-change="pageCurrentChangeHandle"/>
        </div>
    </el-card>
</template>
<style scoped>
  .image {
    width: 60%;
    display: block;
    margin: 0 auto 30px auto;
  }
</style>

<script>
import Cookies from 'js-cookie';
import qs from 'qs';
import mixinViewModule from '@/mixins/view-module';
export default {
    mixins: [mixinViewModule],
    data() {
        return {
            mixinViewModuleOptions: {
                getDataListURL: '/his/getTaskHandleDetailInfo',
                getDataListIsPage: false,
                deleteIsBatch: true,
                deleteIsBatchKey: 'deploymentId'
            },
            dataForm: {
                processInstanceId: ''
            }
        };
    },
    created() {
        this.dataForm.processInstanceId = this.$route.params.processInstanceId;
        this.getResourceURL();
        this.getDataList();
    },
    methods: {
    // 获取流程(xml/image)url地址
        getResourceURL() {
            var params = qs.stringify({
                'token': Cookies.get('token'),
                'processInstanceId': this.dataForm.processInstanceId
            });
            return `${window.SITE_CONFIG['apiURL']}/his/queryInstImage?${params}`;
        }
    }
};
</script>
