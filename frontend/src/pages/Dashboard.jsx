import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import OpportunityCard from '../components/OpportunityCard';
import OpportunityForm from '../components/OpportunityForm';
import CustomSelect from '../components/CustomSelect';
import { 
  Plus, Search, Filter, RefreshCw, BarChart2, CheckCircle2, AlertTriangle, 
  Grid, Kanban, TrendingUp, DollarSign, Activity, Calendar, ChevronLeft, ChevronRight
} from 'lucide-react';

const Dashboard = ({ addToast }) => {
  const { user } = useContext(AuthContext);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  
  // Search, Filters & Sorting
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination states (used in list view)
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  // Modal control
  const [formOpen, setFormOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [activeKanbanStage, setActiveKanbanStage] = useState('New');

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = {
        search,
        stage: stageFilter,
        priority: priorityFilter,
        sortBy
      };

      if (viewMode === 'list') {
        params.page = page;
        params.limit = limit;
      }

      const res = await API.get('/opportunities', { params });
      
      if (viewMode === 'list') {
        setOpportunities(res.data.opportunities || []);
        setPages(res.data.pages || 1);
        setTotal(res.data.total || 0);
      } else {
        setOpportunities(res.data || []);
        setTotal(res.data.length || 0);
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Error fetching opportunities', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch opportunities when filters/sorting/view mode or page changes
  useEffect(() => {
    fetchOpportunities();
  }, [viewMode, page, stageFilter, priorityFilter, sortBy]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setPage(1);
  }, [search, stageFilter, priorityFilter, sortBy]);

  // Trigger search fetch with a slight delay
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOpportunities();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSaveOpportunity = async (payload) => {
    try {
      if (selectedOpportunity) {
        // Edit mode
        await API.put(`/opportunities/${selectedOpportunity._id}`, payload);
        addToast('Opportunity updated successfully', 'success');
      } else {
        // Create mode
        await API.post('/opportunities', payload);
        addToast('Opportunity created successfully', 'success');
      }
      setFormOpen(false);
      setSelectedOpportunity(null);
      fetchOpportunities(); // Reload pipeline with server-side filters applied
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Error saving opportunity', 'error');
    }
  };

  const handleDeleteOpportunity = (id) => {
    setDeleteId(id);
  };

  const triggerDeleteOpportunity = async () => {
    if (!deleteId) return;
    try {
      await API.delete(`/opportunities/${deleteId}`);
      addToast('Opportunity removed successfully', 'success');
      fetchOpportunities();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Error deleting opportunity', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const handleCardUpdate = (updatedOpp) => {
    // Dynamically replace opportunity in the active state list
    setOpportunities((prev) =>
      prev.map((opp) => (opp._id === updatedOpp._id ? updatedOpp : opp))
    );
  };

  const openCreateModal = () => {
    setSelectedOpportunity(null);
    setFormOpen(true);
  };

  const openEditModal = (opp) => {
    setSelectedOpportunity(opp);
    setFormOpen(true);
  };

  // Calculate Dashboard Metrics
  const totalValue = opportunities.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
  const wonOpportunities = opportunities.filter((opp) => opp.stage === 'Won');
  const wonValue = wonOpportunities.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
  const averageValue = opportunities.length > 0 ? Math.round(totalValue / opportunities.length) : 0;
  const highPriorityCount = opportunities.filter((opp) => opp.priority === 'High').length;

  const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

  const stageOptions = [
    { value: 'All', label: 'All Stages' },
    ...STAGES.map((s) => ({ value: s, label: s }))
  ];

  const priorityOptions = [
    { value: 'All', label: 'All Priorities' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest Added' },
    { value: 'value-desc', label: 'Value: High to Low' },
    { value: 'value-asc', label: 'Value: Low to High' },
    { value: 'followup-date', label: 'Next Follow-Up' }
  ];

  return (
    <div className="dashboard-container">
      
      {/* 1. Analytics Header */}
      <div className="metrics-grid">
        <div className="neo-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="neo-inset" style={{ padding: '12px', borderRadius: '50%', color: 'var(--accent-color)', boxShadow: 'var(--shadow-inset-sm)' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>Pipeline Value</span>
            <h3 style={{ fontSize: '20px', fontWeight: '800' }}>${totalValue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="neo-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="neo-inset" style={{ padding: '12px', borderRadius: '50%', color: 'var(--color-success)', boxShadow: 'var(--shadow-inset-sm)' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>Won Deals</span>
            <h3 style={{ fontSize: '20px', fontWeight: '800' }}>${wonValue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="neo-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="neo-inset" style={{ padding: '12px', borderRadius: '50%', color: '#f1c40f', boxShadow: 'var(--shadow-inset-sm)' }}>
            <Activity size={22} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>Average Value</span>
            <h3 style={{ fontSize: '20px', fontWeight: '800' }}>${averageValue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="neo-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="neo-inset" style={{ padding: '12px', borderRadius: '50%', color: 'var(--color-danger)', boxShadow: 'var(--shadow-inset-sm)' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>High Priority</span>
            <h3 style={{ fontSize: '20px', fontWeight: '800' }}>{highPriorityCount} / {opportunities.length}</h3>
          </div>
        </div>
      </div>

      {/* 2. Controls Panel */}
      <div className="neo-card controls-container">
        {/* Left Search & Filter inputs */}
        <div className="controls-left">
          <div className="search-container">
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              className="neo-input"
              placeholder="Search customer, summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '42px' }}
            />
          </div>

          <CustomSelect
            value={stageFilter}
            onChange={setStageFilter}
            options={stageOptions}
          />

          <CustomSelect
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={priorityOptions}
          />

          <CustomSelect
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
            className="sort-container"
          />
        </div>

        {/* Right Toggle and Add Controls */}
        <div className="controls-right">
          <button
            onClick={fetchOpportunities}
            className="neo-btn neo-btn-icon"
            title="Refresh Data"
          >
            <RefreshCw size={16} className={loading ? 'spin-loading' : ''} />
          </button>

          <div className="neo-inset" style={{ 
            height: '46px', 
            padding: '0 4px', 
            borderRadius: 'var(--border-radius-sm)', 
            display: 'inline-flex', 
            alignItems: 'center',
            gap: '4px', 
            boxShadow: 'var(--shadow-inset-sm)' 
          }}>
            <button
              onClick={() => setViewMode('list')}
              className="neo-btn"
              style={{
                height: '38px',
                width: '38px',
                padding: 0,
                borderRadius: '8px',
                boxShadow: viewMode === 'list' ? 'var(--shadow-inset-sm)' : 'none',
                background: viewMode === 'list' ? 'rgba(0,0,0,0.03)' : 'transparent',
                color: viewMode === 'list' ? 'var(--accent-color)' : 'var(--text-light)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="List Card View"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className="neo-btn"
              style={{
                height: '38px',
                width: '38px',
                padding: 0,
                borderRadius: '8px',
                boxShadow: viewMode === 'kanban' ? 'var(--shadow-inset-sm)' : 'none',
                background: viewMode === 'kanban' ? 'rgba(0,0,0,0.03)' : 'transparent',
                color: viewMode === 'kanban' ? 'var(--accent-color)' : 'var(--text-light)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Kanban Board View"
            >
              <Kanban size={16} />
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="neo-btn neo-btn-primary"
          >
            <Plus size={16} /> <span className="hide-mobile">Add Deal</span>
          </button>
        </div>
      </div>

      {/* 3. Dashboard Pipeline Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid var(--shadow-dark)', borderTop: '4px solid var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : opportunities.length === 0 ? (
        <div className="neo-card empty-state-card">
          <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>No Deals Found</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '24px' }}>
            No opportunities matched your search criteria or none have been added yet.
          </p>
          <button onClick={openCreateModal} className="neo-btn neo-btn-primary" style={{ padding: '12px 24px' }}>
            <Plus size={16} /> Add Your First Opportunity
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* List View (with Pagination controls) */
        <div className="card-list-wrapper">
          <div className="opportunity-grid">
            {opportunities.map((opp) => (
              <OpportunityCard
                key={opp._id}
                opportunity={opp}
                onEdit={openEditModal}
                onDelete={handleDeleteOpportunity}
                onUpdate={handleCardUpdate}
              />
            ))}
          </div>

          {/* Pagination Controller Bar */}
          {pages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              marginTop: '16px',
              padding: '16px',
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--shadow-outset-sm)',
              background: 'var(--bg-color)',
              maxWidth: '300px',
              alignSelf: 'center'
            }}>
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="neo-btn"
                disabled={page === 1}
                style={{ padding: '8px', borderRadius: '50%' }}
              >
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-color)' }}>
                {page} / {pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, pages))}
                className="neo-btn"
                disabled={page === pages}
                style={{ padding: '8px', borderRadius: '50%' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Kanban View */
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Mobile Kanban Stage Tabs */}
          <div className="mobile-kanban-tabs">
            {STAGES.map((s) => {
              const colOpportunitiesCount = opportunities.filter((opp) => opp.stage === s).length;
              const isActive = activeKanbanStage === s;
              return (
                <button
                  key={s}
                  onClick={() => setActiveKanbanStage(s)}
                  className="neo-btn"
                  style={{
                    height: '36px',
                    padding: '0 16px',
                    fontSize: '12.5px',
                    borderRadius: '20px',
                    boxShadow: isActive ? 'var(--shadow-inset-sm)' : 'var(--shadow-outset-sm)',
                    color: isActive ? 'var(--accent-color)' : 'var(--text-light)',
                    fontWeight: isActive ? '700' : '500'
                  }}
                >
                  {s} ({colOpportunitiesCount})
                </button>
              );
            })}
          </div>

          <div className="kanban-board">
            {STAGES.map((colStage) => {
              const colOpportunities = opportunities.filter((opp) => opp.stage === colStage);
              const colTotalValue = colOpportunities.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
              
              return (
                <div 
                  key={colStage} 
                  className={`kanban-col ${activeKanbanStage === colStage ? 'active-col' : ''}`}
                >
                  <div className="kanban-col-title">
                    <span>{colStage}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        background: 'var(--bg-color)',
                        boxShadow: 'var(--shadow-inset-sm)',
                        fontWeight: '700'
                      }}>
                        {colOpportunities.length}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: '800' }}>
                        ${colTotalValue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    overflowY: 'auto',
                    maxHeight: '65vh',
                    padding: '4px'
                  }}>
                    {colOpportunities.map((opp) => (
                      <OpportunityCard
                        key={opp._id}
                        opportunity={opp}
                        onEdit={openEditModal}
                        onDelete={handleDeleteOpportunity}
                        onUpdate={handleCardUpdate}
                      />
                    ))}
                    {colOpportunities.length === 0 && (
                      <div style={{
                        textAlign: 'center',
                        padding: '30px 10px',
                        color: 'var(--text-light)',
                        fontSize: '12px',
                        border: '2px dashed var(--shadow-dark)',
                        borderRadius: 'var(--border-radius-sm)',
                        opacity: 0.6
                      }}>
                        No deals in {colStage.toLowerCase()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Form Modal */}
      {formOpen && (
        <OpportunityForm
          opportunity={selectedOpportunity}
          onClose={() => {
            setFormOpen(false);
            setSelectedOpportunity(null);
          }}
          onSave={handleSaveOpportunity}
        />
      )}

      {/* Custom Neumorphic Delete Confirm Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div 
            className="modal-content neo-card" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '400px', padding: '32px', textAlign: 'center' }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: '850', marginBottom: '12px', letterSpacing: '-0.3px' }}>
              Confirm Deletion
            </h3>
            <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
              Are you sure you want to delete this opportunity? This action is permanent and cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
              <button 
                onClick={() => setDeleteId(null)} 
                className="neo-btn" 
                style={{ padding: '0 22px' }}
              >
                Cancel
              </button>
              <button 
                onClick={triggerDeleteOpportunity} 
                className="neo-btn neo-btn-danger" 
                style={{ padding: '0 22px' }}
              >
                Delete Deal
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .spin-loading {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 576px) {
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
