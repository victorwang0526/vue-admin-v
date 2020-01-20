<template>
    <el-card
        shadow="never"
        class="aui-card--fill">
        <div class="mod-leave}">
            <el-form
                :inline="true"
                :model="dataForm"
                @keyup.enter.native="getDataList()">
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="addLeave()">
                        {{ $t('add') }}
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="danger"
                        @click="deleteHandle()">
                        {{ $t('deleteBatch') }}
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table
                v-loading="dataListLoading"
                :data="dataList"
                border
                style="width: 100%;"
                @selection-change="dataListSelectionChangeHandle">
                <el-table-column
                    type="selection"
                    header-align="center"
                    align="center"
                    width="50"/>
                <el-table-column
                    :label="$t('process.instanceId')"
                    prop="instanceId"
                    header-align="center"
                    align="center"/>
                <el-table-column
                    :label="$t('leave.leaveDays')"
                    prop="leaveDays"
                    header-align="center"
                    align="center"/>
                <el-table-column
                    :label="$t('leave.beginDate')"
                    prop="beginDate"
                    header-align="center"
                    align="center"/>
                <el-table-column
                    :label="$t('leave.endDate')"
                    prop="endDate"
                    header-align="center"
                    align="center"/>
                <el-table-column
                    :label="$t('leave.leaveReason')"
                    prop="leaveReason"
                    header-align="center"
                    align="center"/>
                <el-table-column
                    :label="$t('createDate')"
                    prop="createDate"
                    header-align="center"
                    align="center"/>
            </el-table>
            <el-pagination
                :current-page="page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="limit"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="pageSizeChangeHandle"
                @current-change="pageCurrentChangeHandle"/>
            <!-- 弹窗, 新增 / 修改 -->
            <add-or-update
                v-if="addOrUpdateVisible"
                ref="addOrUpdate"
                @refreshDataList="getDataList"/>
        </div>
    </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module';
import AddOrUpdate from './leave-add-or-update';
export default {
    components: {
        AddOrUpdate
    },
    mixins: [mixinViewModule],
    data() {
        return {
            mixinViewModuleOptions: {
                getDataListURL: '/demo/leave/page',
                getDataListIsPage: true,
                deleteIsBatch: true
            },
            dataForm: {
                id: ''
            }
        };
    },
    methods: {
        addLeave() {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.dataForm.processDefinationKey = 'processleavedemo';
                this.$refs.addOrUpdate.init();
            });
        }
    }
};
</script>
